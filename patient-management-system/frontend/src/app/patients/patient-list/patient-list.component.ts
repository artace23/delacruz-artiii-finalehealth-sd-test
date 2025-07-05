import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  error = '';
  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = '';
    
    this.patientService.getPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients) => {
          this.patients = patients;
          this.filteredPatients = patients;
          this.calculatePagination();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load patients. Please try again.';
          this.loading = false;
          console.error('Error loading patients:', error);
        }
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        const trimmedSearch = searchTerm?.trim();
        if (trimmedSearch) {
          this.patientService.searchPatients(trimmedSearch)
            .pipe(takeUntil(this.destroy$))
            .subscribe(patients => {
              this.filteredPatients = patients;
              this.currentPage = 1;
              this.calculatePagination();
            });
        } else {
          this.filteredPatients = this.patients;
          this.currentPage = 1;
          this.calculatePagination();
        }
      });
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
  }

  get paginatedPatients(): Patient[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPatients.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onEditPatient(patient: Patient): void {
    this.router.navigate(['/patients', patient._id, 'edit']);
  }

  onViewVisits(patient: Patient): void {
    this.router.navigate(['/patients', patient._id, 'visits']);
  }

  onDeletePatient(patient: Patient): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${patient.firstName} ${patient.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deletePatient(patient._id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              Swal.fire('Deleted!', 'The patient has been deleted.', 'success');
              this.loadPatients();
            },
            error: (error) => {
              Swal.fire('Error', 'Failed to delete patient. Please try again.', 'error');
              this.error = 'Failed to delete patient. Please try again.';
              console.error('Error deleting patient:', error);
            }
          });
      }
    });
  }

  onAddPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }
} 
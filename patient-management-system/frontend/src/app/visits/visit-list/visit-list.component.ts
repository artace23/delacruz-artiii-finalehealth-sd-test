import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VisitService } from '../../services/visit.service';
import { PatientService } from '../../services/patient.service';
import { Visit, VisitType } from '../../models/visit.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit, OnDestroy {
  visits: Visit[] = [];
  patient: Patient | null = null;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private visitService: VisitService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
      this.loadVisits(patientId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatient(patientId: string): void {
    if (!patientId) {
      console.error('Patient ID is required');
      return;
    }
    
    this.patientService.getPatient(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient) => {
          this.patient = patient;
        },
        error: (error) => {
          console.error('Error loading patient:', error);
          this.error = 'Failed to load patient information.';
        }
      });
  }

  loadVisits(patientId: string): void {
    this.loading = true;
    this.error = '';

    this.visitService.getVisitsByPatient(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (visits) => {
          this.visits = visits;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load visits. Please try again.';
          this.loading = false;
          console.error('Error loading visits:', error);
        }
      });
  }

  onAddVisit(): void {
    if (this.patient?._id) {
      this.router.navigate(['/patients', this.patient._id, 'visits', 'new']);
    }
  }

  onEditVisit(visit: Visit): void {
    this.router.navigate(['/visits', visit._id, 'edit']);
  }

  onDeleteVisit(visit: Visit): void {
    if (confirm(`Are you sure you want to delete this visit?`)) {
      this.visitService.deleteVisit(visit._id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadVisits(this.patient!._id!);
          },
          error: (error) => {
            this.error = 'Failed to delete visit. Please try again.';
            console.error('Error deleting visit:', error);
          }
        });
    }
  }

  onBackToPatients(): void {
    this.router.navigate(['/patients']);
  }

  getVisitTypeLabel(visitType: VisitType): string {
    return visitType;
  }

  getVisitTypeClass(visitType: VisitType): string {
    switch (visitType) {
      case VisitType.Home:
        return 'visit-type-home';
      case VisitType.Telehealth:
        return 'visit-type-telehealth';
      case VisitType.Clinic:
        return 'visit-type-clinic';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
} 
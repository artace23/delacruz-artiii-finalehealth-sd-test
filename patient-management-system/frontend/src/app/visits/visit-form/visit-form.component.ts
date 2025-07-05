import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VisitService } from '../../services/visit.service';
import { PatientService } from '../../services/patient.service';
import { Visit, CreateVisitDto, UpdateVisitDto, VisitType } from '../../models/visit.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent implements OnInit, OnDestroy {
  visitForm!: FormGroup;
  visit: Visit | null = null;
  patient: Patient | null = null;
  loading = false;
  saving = false;
  error = '';
  isEditMode = false;
  visitTypes = Object.values(VisitType);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.visitForm = this.fb.group({
      visitDate: ['', [Validators.required]],
      visitType: ['', [Validators.required]],
      notes: ['']
    });
  }

  private checkEditMode(): void {
    // Check if we're in edit mode by looking at the URL path
    const url = this.router.url;
    
    if (url.includes('/visits/') && url.includes('/edit')) {
      // We're editing an existing visit
      this.isEditMode = true;
      const visitId = this.route.snapshot.paramMap.get('id');
      if (visitId) {
        this.loadVisit(visitId);
      }
    } else {
      // We're creating a new visit
      this.isEditMode = false;
      const patientId = this.route.snapshot.paramMap.get('id'); // This is the patient ID from patients/:id/visits/new
      if (patientId) {
        this.loadPatient(patientId);
      }
    }
  }

  private loadVisit(id: string): void {
    this.loading = true;
    this.error = '';

    this.visitService.getVisit(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (visit) => {
          this.visit = visit;
          this.patchForm(visit);
          this.loadPatient(visit.patientId);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load visit. Please try again.';
          this.loading = false;
          console.error('Error loading visit:', error);
        }
      });
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

  private patchForm(visit: Visit): void {
    this.visitForm.patchValue({
      visitDate: this.formatDateForInput(visit.visitDate),
      visitType: visit.visitType,
      notes: visit.notes || ''
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  }

  onSubmit(): void {
    if (this.visitForm.valid) {
      this.saving = true;
      this.error = '';

      const formValue = this.visitForm.value;
      const visitData: CreateVisitDto | UpdateVisitDto = {
        visitDate: new Date(formValue.visitDate).toISOString(),
        visitType: formValue.visitType,
        notes: formValue.notes || undefined
      };

      if (this.isEditMode && this.visit?._id) {
        this.updateVisit(this.visit._id, visitData);
      } else if (this.patient?._id) {
        this.createVisit(this.patient._id, visitData as CreateVisitDto);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createVisit(patientId: string, visitData: CreateVisitDto): void {
    console.log('Frontend sending visit data:', { patientId, visitData });
    this.visitService.createVisit(patientId, visitData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newVisit) => {
          console.log('Visit created successfully:', newVisit);
          this.saving = false;
          this.router.navigate(['/patients', patientId, 'visits']);
        },
        error: (error) => {
          this.error = 'Failed to create visit. Please try again.';
          this.saving = false;
          console.error('Error creating visit:', error);
        }
      });
  }

  private updateVisit(id: string, visitData: UpdateVisitDto): void {
    this.visitService.updateVisit(id, visitData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedVisit) => {
          this.saving = false;
          this.router.navigate(['/patients', updatedVisit.patientId, 'visits']);
        },
        error: (error) => {
          this.error = 'Failed to update visit. Please try again.';
          this.saving = false;
          console.error('Error updating visit:', error);
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.visitForm.controls).forEach(key => {
      const control = this.visitForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.patient?._id) {
      this.router.navigate(['/patients', this.patient._id, 'visits']);
    } else {
      this.router.navigate(['/patients']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.visitForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      visitDate: 'Visit date',
      visitType: 'Visit type',
      notes: 'Notes'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.visitForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 
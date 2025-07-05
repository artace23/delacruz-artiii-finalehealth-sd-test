import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../../models/patient.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit, OnDestroy {
  patientForm!: FormGroup;
  patient: Patient | null = null;
  loading = false;
  saving = false;
  error = '';
  isEditMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
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
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  private checkEditMode(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.isEditMode = true;
      this.loadPatient(patientId);
    }
  }

  private loadPatient(id: string): void {
    this.loading = true;
    this.error = '';

    this.patientService.getPatient(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient) => {
          this.patient = patient;
          this.patchForm(patient);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load patient. Please try again.';
          this.loading = false;
          console.error('Error loading patient:', error);
        }
      });
  }

  private patchForm(patient: Patient): void {
    this.patientForm.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: this.formatDateForInput(patient.dob),
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      address: patient.address
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.saving = true;
      this.error = '';

      const formValue = this.patientForm.value;
      const patientData: CreatePatientDto | UpdatePatientDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dob: formValue.dob,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        address: formValue.address
      };

      if (this.isEditMode && this.patient?._id) {
        this.updatePatient(this.patient._id, patientData);
      } else {
        this.createPatient(patientData as CreatePatientDto);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createPatient(patientData: CreatePatientDto): void {
    this.patientService.createPatient(patientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPatient) => {
          this.saving = false;
          Swal.fire('Success', 'Patient created successfully!', 'success');
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.error = 'Failed to create patient. Please try again.';
          this.saving = false;
          Swal.fire('Error', 'Failed to create patient. Please try again.', 'error');
          console.error('Error creating patient:', error);
        }
      });
  }

  private updatePatient(id: string, patientData: UpdatePatientDto): void {
    this.patientService.updatePatient(id, patientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPatient) => {
          this.saving = false;
          Swal.fire('Success', 'Patient updated successfully!', 'success');
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.error = 'Failed to update patient. Please try again.';
          this.saving = false;
          Swal.fire('Error', 'Failed to update patient. Please try again.', 'error');
          console.error('Error updating patient:', error);
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  getFieldError(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be no more than ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phoneNumber') {
          return 'Please enter a valid phone number';
        }
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      dob: 'Date of birth',
      email: 'Email',
      phoneNumber: 'Phone number',
      address: 'Address'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 
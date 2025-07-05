import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PatientService } from '../services/patient.service';
import { VisitService } from '../services/visit.service';
import { Patient } from '../models/patient.model';
import { Visit, VisitType } from '../models/visit.model';

interface PatientSummary {
  patient: Patient;
  totalVisits: number;
  visitTypes: { [key in VisitType]: number };
  lastVisit?: string;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  patientSummaries: PatientSummary[] = [];
  loading = false;
  error = '';
  totalPatients = 0;
  totalVisits = 0;
  visitTypeStats: { [key in VisitType]: number } = {
    [VisitType.Home]: 0,
    [VisitType.Telehealth]: 0,
    [VisitType.Clinic]: 0
  };
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private visitService: VisitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSummaryData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSummaryData(): void {
    this.loading = true;
    this.error = '';

    this.patientService.getPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients) => {
          this.patients = patients;
          this.totalPatients = patients.length;
          this.loadVisitsForAllPatients();
        },
        error: (error) => {
          this.error = 'Failed to load patients. Please try again.';
          this.loading = false;
          console.error('Error loading patients:', error);
        }
      });
  }

  private loadVisitsForAllPatients(): void {
    if (this.patients.length === 0) {
      this.loading = false;
      return;
    }

    const visitRequests = this.patients.map(patient =>
      this.visitService.getVisitsByPatient(patient._id!)
    );

    forkJoin(visitRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (visitsArrays) => {
          this.processVisitsData(visitsArrays);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load visits data. Please try again.';
          this.loading = false;
          console.error('Error loading visits:', error);
        }
      });
  }

  private processVisitsData(visitsArrays: Visit[][]): void {
    this.patientSummaries = [];
    this.totalVisits = 0;
    this.visitTypeStats = {
      [VisitType.Home]: 0,
      [VisitType.Telehealth]: 0,
      [VisitType.Clinic]: 0
    };

    this.patients.forEach((patient, index) => {
      const visits = visitsArrays[index] || [];
      const summary = this.createPatientSummary(patient, visits);
      this.patientSummaries.push(summary);
      
      this.totalVisits += summary.totalVisits;
      Object.keys(summary.visitTypes).forEach(type => {
        this.visitTypeStats[type as VisitType] += summary.visitTypes[type as VisitType];
      });
    });

    // Sort by total visits (descending)
    this.patientSummaries.sort((a, b) => b.totalVisits - a.totalVisits);
  }

  private createPatientSummary(patient: Patient, visits: Visit[]): PatientSummary {
    const visitTypes: { [key in VisitType]: number } = {
      [VisitType.Home]: 0,
      [VisitType.Telehealth]: 0,
      [VisitType.Clinic]: 0
    };

    visits.forEach(visit => {
      visitTypes[visit.visitType]++;
    });

    const lastVisit = visits.length > 0 
      ? visits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0].visitDate
      : undefined;

    return {
      patient,
      totalVisits: visits.length,
      visitTypes,
      lastVisit
    };
  }

  onViewPatientVisits(patientId: string): void {
    this.router.navigate(['/patients', patientId, 'visits']);
  }

  onBackToPatients(): void {
    this.router.navigate(['/patients']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
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

  getMostActivePatients(): PatientSummary[] {
    return this.patientSummaries.slice(0, 5);
  }

  getPatientsWithNoVisits(): PatientSummary[] {
    return this.patientSummaries.filter(summary => summary.totalVisits === 0);
  }
} 
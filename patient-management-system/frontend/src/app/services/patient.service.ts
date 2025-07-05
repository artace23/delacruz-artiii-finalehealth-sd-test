import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all patients
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      tap(patients => this.patientsSubject.next(patients)),
      catchError(this.handleError)
    );
  }

  // Get patient by ID
  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new patient
  createPatient(patient: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      tap(newPatient => {
        const currentPatients = this.patientsSubject.value;
        this.patientsSubject.next([...currentPatients, newPatient]);
      }),
      catchError(this.handleError)
    );
  }

  // Update patient
  updatePatient(id: string, patient: UpdatePatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient).pipe(
      tap(updatedPatient => {
        const currentPatients = this.patientsSubject.value;
        const updatedPatients = currentPatients.map(p => 
          p._id === id ? updatedPatient : p
        );
        this.patientsSubject.next(updatedPatients);
      }),
      catchError(this.handleError)
    );
  }

  // Delete patient
  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentPatients = this.patientsSubject.value;
        const filteredPatients = currentPatients.filter(p => p._id !== id);
        this.patientsSubject.next(filteredPatients);
      }),
      catchError(this.handleError)
    );
  }

  // Search patients by name or email
  searchPatients(query: string): Observable<Patient[]> {
    const currentPatients = this.patientsSubject.value;
    const filteredPatients = currentPatients.filter(patient =>
      patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase())
    );
    return new Observable(observer => {
      observer.next(filteredPatients);
      observer.complete();
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 
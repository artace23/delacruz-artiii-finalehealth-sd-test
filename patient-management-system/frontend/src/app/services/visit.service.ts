import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Visit, CreateVisitDto, UpdateVisitDto } from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:3000';
  private visitsSubject = new BehaviorSubject<Visit[]>([]);
  public visits$ = this.visitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get visits by patient ID
  getVisitsByPatient(patientId: string): Observable<Visit[]> {
    console.log('Fetching visits for patient:', patientId);
    return this.http.get<Visit[]>(`${this.apiUrl}/patients/${patientId}/visits`).pipe(
      tap(visits => {
        console.log('Received visits from backend:', visits);
        this.visitsSubject.next(visits);
      }),
      catchError(this.handleError)
    );
  }

  // Create new visit
  createVisit(patientId: string, visit: CreateVisitDto): Observable<Visit> {
    console.log('Visit service sending request to:', `${this.apiUrl}/patients/${patientId}/visits`);
    console.log('Visit service sending data:', visit);
    return this.http.post<Visit>(`${this.apiUrl}/patients/${patientId}/visits`, visit).pipe(
      tap(newVisit => {
        console.log('Visit service received response:', newVisit);
        const currentVisits = this.visitsSubject.value;
        this.visitsSubject.next([...currentVisits, newVisit]);
      }),
      catchError(this.handleError)
    );
  }

  // Update visit
  updateVisit(id: string, visit: UpdateVisitDto): Observable<Visit> {
    return this.http.put<Visit>(`${this.apiUrl}/visits/${id}`, visit).pipe(
      tap(updatedVisit => {
        const currentVisits = this.visitsSubject.value;
        const updatedVisits = currentVisits.map(v => 
          v._id === id ? updatedVisit : v
        );
        this.visitsSubject.next(updatedVisits);
      }),
      catchError(this.handleError)
    );
  }

  // Delete visit
  deleteVisit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/visits/${id}`).pipe(
      tap(() => {
        const currentVisits = this.visitsSubject.value;
        const filteredVisits = currentVisits.filter(v => v._id !== id);
        this.visitsSubject.next(filteredVisits);
      }),
      catchError(this.handleError)
    );
  }

  // Get visit by ID
  getVisit(id: string): Observable<Visit> {
    return this.http.get<Visit>(`${this.apiUrl}/visits/${id}`).pipe(
      catchError(this.handleError)
    );
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
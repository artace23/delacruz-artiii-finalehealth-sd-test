import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', loadComponent: () => import('./patients/patient-list/patient-list.component').then(m => m.PatientListComponent) },
  { path: 'patients/new', loadComponent: () => import('./patients/patient-form/patient-form.component').then(m => m.PatientFormComponent) },
  { path: 'patients/:id/edit', loadComponent: () => import('./patients/patient-form/patient-form.component').then(m => m.PatientFormComponent) },
  { path: 'patients/:id/visits', loadComponent: () => import('./visits/visit-list/visit-list.component').then(m => m.VisitListComponent) },
  { path: 'patients/:id/visits/new', loadComponent: () => import('./visits/visit-form/visit-form.component').then(m => m.VisitFormComponent) },
  { path: 'visits/:id/edit', loadComponent: () => import('./visits/visit-form/visit-form.component').then(m => m.VisitFormComponent) },
  { path: 'summary', loadComponent: () => import('./summary/summary.component').then(m => m.SummaryComponent) }
];

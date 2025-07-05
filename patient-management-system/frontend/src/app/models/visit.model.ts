export enum VisitType {
  Home = 'Home',
  Telehealth = 'Telehealth',
  Clinic = 'Clinic'
}

export interface Visit {
  _id?: string;
  patientId: string;
  visitDate: string;
  notes?: string;
  visitType: VisitType;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface CreateVisitDto {
  visitDate: string;
  notes?: string;
  visitType: VisitType;
}

export interface UpdateVisitDto extends Partial<CreateVisitDto> {} 
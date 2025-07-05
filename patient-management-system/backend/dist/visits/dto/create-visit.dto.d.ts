import { VisitType } from '../schemas/visit.schema';
export declare class CreateVisitDto {
    patientId: string;
    visitDate: string;
    notes?: string;
    visitType: VisitType;
}

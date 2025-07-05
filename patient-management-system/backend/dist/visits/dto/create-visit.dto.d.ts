import { VisitType } from '../schemas/visit.schema';
export declare class CreateVisitDto {
    visitDate: string;
    notes?: string;
    visitType: VisitType;
}

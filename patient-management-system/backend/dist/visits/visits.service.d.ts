import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
export declare class VisitsService {
    private visitModel;
    constructor(visitModel: Model<VisitDocument>);
    create(createVisitDto: CreateVisitDto & {
        patientId: string;
    }): Promise<Visit>;
    findOne(id: string): Promise<Visit>;
    findByPatient(patientId: string): Promise<Visit[]>;
    update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit>;
    remove(id: string): Promise<void>;
}

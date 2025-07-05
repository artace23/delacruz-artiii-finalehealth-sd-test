import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    create(patientId: string, createVisitDto: CreateVisitDto): Promise<import("./schemas/visit.schema").Visit>;
    findByPatient(patientId: string): Promise<import("./schemas/visit.schema").Visit[]>;
}
export declare class VisitActionsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    findOne(id: string): Promise<import("./schemas/visit.schema").Visit>;
    update(id: string, updateVisitDto: UpdateVisitDto): Promise<import("./schemas/visit.schema").Visit>;
    remove(id: string): Promise<void>;
}

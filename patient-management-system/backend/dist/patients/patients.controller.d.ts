import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: CreatePatientDto): Promise<import("./schemas/patient.schema").Patient>;
    findAll(): Promise<import("./schemas/patient.schema").Patient[]>;
    findOne(id: string): Promise<import("./schemas/patient.schema").Patient>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<import("./schemas/patient.schema").Patient>;
    remove(id: string): Promise<void>;
}

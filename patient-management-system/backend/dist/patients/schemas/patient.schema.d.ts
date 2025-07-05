import { Document } from 'mongoose';
export type PatientDocument = Patient & Document;
export declare class Patient {
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    phoneNumber: string;
    address: string;
    dateCreated: Date;
    dateUpdated: Date;
}
export declare const PatientSchema: import("mongoose").Schema<Patient, import("mongoose").Model<Patient, any, any, any, Document<unknown, any, Patient, any> & Patient & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Patient, Document<unknown, {}, import("mongoose").FlatRecord<Patient>, {}> & import("mongoose").FlatRecord<Patient> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

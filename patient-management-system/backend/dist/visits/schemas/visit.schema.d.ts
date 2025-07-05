import { Document, Types } from 'mongoose';
export type VisitDocument = Visit & Document;
export declare enum VisitType {
    Home = "Home",
    Telehealth = "Telehealth",
    Clinic = "Clinic"
}
export declare class Visit {
    patientId: Types.ObjectId;
    visitDate: Date;
    notes?: string;
    visitType: VisitType;
    dateCreated: Date;
    dateUpdated: Date;
}
export declare const VisitSchema: import("mongoose").Schema<Visit, import("mongoose").Model<Visit, any, any, any, Document<unknown, any, Visit, any> & Visit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Visit, Document<unknown, {}, import("mongoose").FlatRecord<Visit>, {}> & import("mongoose").FlatRecord<Visit> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

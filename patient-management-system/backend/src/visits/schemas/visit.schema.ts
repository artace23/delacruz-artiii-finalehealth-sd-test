import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitDocument = Visit & Document;

export enum VisitType {
  Home = 'Home',
  Telehealth = 'Telehealth',
  Clinic = 'Clinic',
}

@Schema({ timestamps: true })
export class Visit {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  visitDate: Date;

  @Prop()
  notes?: string;

  @Prop({ required: true, enum: VisitType })
  visitType: VisitType;

  @Prop({ default: Date.now })
  dateCreated: Date;

  @Prop({ default: Date.now })
  dateUpdated: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit); 
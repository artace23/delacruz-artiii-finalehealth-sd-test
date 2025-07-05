import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async create(createVisitDto: CreateVisitDto & { patientId: string }): Promise<Visit> {
    console.log('Service creating visit with:', createVisitDto);
    const createdVisit = new this.visitModel({
      ...createVisitDto,
      patientId: new Types.ObjectId(createVisitDto.patientId),
    });
    console.log('Visit model before save:', createdVisit);
    const savedVisit = await createdVisit.save();
    console.log('Visit saved successfully:', savedVisit);
    return savedVisit;
  }

  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitModel.findById(id).exec();
    if (!visit) throw new NotFoundException('Visit not found');
    return visit;
  }

  async findByPatient(patientId: string): Promise<Visit[]> {
    console.log('Finding visits for patient:', patientId);
    const visits = await this.visitModel.find({ patientId: new Types.ObjectId(patientId) }).exec();
    console.log('Found visits:', visits);
    return visits;
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const updated = await this.visitModel.findByIdAndUpdate(id, updateVisitDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Visit not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.visitModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Visit not found');
  }
} 
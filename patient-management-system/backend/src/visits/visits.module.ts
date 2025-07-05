import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from './schemas/visit.schema';
import { VisitsService } from './visits.service';
import { VisitsController, VisitActionsController } from './visits.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }])],
  controllers: [VisitsController, VisitActionsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {} 
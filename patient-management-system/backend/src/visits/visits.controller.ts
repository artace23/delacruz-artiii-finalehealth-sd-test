import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Controller('patients/:patientId/visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Param('patientId') patientId: string, @Body() createVisitDto: CreateVisitDto) {
    console.log('Creating visit with data:', { patientId, createVisitDto });
    return this.visitsService.create({ ...createVisitDto, patientId });
  }

  @Get()
  findByPatient(@Param('patientId') patientId: string) {
    console.log('Controller finding visits for patient:', patientId);
    return this.visitsService.findByPatient(patientId);
  }
}

@Controller('visits')
export class VisitActionsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitsService.remove(id);
  }
} 
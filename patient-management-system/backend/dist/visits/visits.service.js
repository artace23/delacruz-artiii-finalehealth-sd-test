"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const visit_schema_1 = require("./schemas/visit.schema");
let VisitsService = class VisitsService {
    visitModel;
    constructor(visitModel) {
        this.visitModel = visitModel;
    }
    async create(createVisitDto) {
        console.log('Service creating visit with:', createVisitDto);
        const createdVisit = new this.visitModel({
            ...createVisitDto,
            patientId: new mongoose_2.Types.ObjectId(createVisitDto.patientId),
        });
        console.log('Visit model before save:', createdVisit);
        const savedVisit = await createdVisit.save();
        console.log('Visit saved successfully:', savedVisit);
        return savedVisit;
    }
    async findOne(id) {
        const visit = await this.visitModel.findById(id).exec();
        if (!visit)
            throw new common_1.NotFoundException('Visit not found');
        return visit;
    }
    async findByPatient(patientId) {
        console.log('Finding visits for patient:', patientId);
        const visits = await this.visitModel.find({ patientId: new mongoose_2.Types.ObjectId(patientId) }).exec();
        console.log('Found visits:', visits);
        return visits;
    }
    async update(id, updateVisitDto) {
        const updated = await this.visitModel.findByIdAndUpdate(id, updateVisitDto, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('Visit not found');
        return updated;
    }
    async remove(id) {
        const result = await this.visitModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Visit not found');
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(visit_schema_1.Visit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VisitsService);
//# sourceMappingURL=visits.service.js.map
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
exports.VisitActionsController = exports.VisitsController = void 0;
const common_1 = require("@nestjs/common");
const visits_service_1 = require("./visits.service");
const create_visit_dto_1 = require("./dto/create-visit.dto");
const update_visit_dto_1 = require("./dto/update-visit.dto");
let VisitsController = class VisitsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    create(patientId, createVisitDto) {
        console.log('Creating visit with data:', { patientId, createVisitDto });
        return this.visitsService.create({ ...createVisitDto, patientId });
    }
    findByPatient(patientId) {
        console.log('Controller finding visits for patient:', patientId);
        return this.visitsService.findByPatient(patientId);
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_visit_dto_1.CreateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findByPatient", null);
exports.VisitsController = VisitsController = __decorate([
    (0, common_1.Controller)('patients/:patientId/visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitsController);
let VisitActionsController = class VisitActionsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    findOne(id) {
        return this.visitsService.findOne(id);
    }
    update(id, updateVisitDto) {
        return this.visitsService.update(id, updateVisitDto);
    }
    remove(id) {
        return this.visitsService.remove(id);
    }
};
exports.VisitActionsController = VisitActionsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitActionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_visit_dto_1.UpdateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitActionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitActionsController.prototype, "remove", null);
exports.VisitActionsController = VisitActionsController = __decorate([
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitActionsController);
//# sourceMappingURL=visits.controller.js.map
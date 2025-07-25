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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitSchema = exports.Visit = exports.VisitType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var VisitType;
(function (VisitType) {
    VisitType["Home"] = "Home";
    VisitType["Telehealth"] = "Telehealth";
    VisitType["Clinic"] = "Clinic";
})(VisitType || (exports.VisitType = VisitType = {}));
let Visit = class Visit {
    patientId;
    visitDate;
    notes;
    visitType;
    dateCreated;
    dateUpdated;
};
exports.Visit = Visit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Patient', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Visit.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Visit.prototype, "visitDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Visit.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: VisitType }),
    __metadata("design:type", String)
], Visit.prototype, "visitType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Visit.prototype, "dateCreated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Visit.prototype, "dateUpdated", void 0);
exports.Visit = Visit = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Visit);
exports.VisitSchema = mongoose_1.SchemaFactory.createForClass(Visit);
//# sourceMappingURL=visit.schema.js.map
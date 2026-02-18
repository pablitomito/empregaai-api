"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const jobSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Título da vaga é obrigatório'],
        trim: true,
        index: true,
    },
    company: {
        type: String,
        required: [true, 'Nome da empresa é obrigatório'],
        trim: true,
        index: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    workModel: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: [String],
    responsibilities: [String],
    benefits: [String],
    contractType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
        default: 'full-time',
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
        default: 'entry',
    },
    industry: {
        type: String,
        required: true,
        index: true,
    },
    keywords: [String],
    salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'EUR' },
        period: {
            type: String,
            enum: ['hourly', 'monthly', 'yearly'],
            default: 'monthly',
        },
    },
    source: {
        type: String,
        enum: ['indeed', 'linkedin', 'net-empregos', 'sapo-emprego', 'manual', 'scraping'],
        required: true,
    },
    externalId: String,
    externalUrl: String,
    quality: {
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 50,
        },
        isQualityJob: {
            type: Boolean,
            default: true,
        },
        isEmergencyJob: {
            type: Boolean,
            default: false,
        },
    },
    status: {
        type: String,
        enum: ['active', 'filled', 'expired', 'closed'],
        default: 'active',
        index: true,
    },
    postedDate: Date,
    expiresAt: Date,
    stats: {
        views: { type: Number, default: 0 },
        applications: { type: Number, default: 0 },
        matches: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});
// Índices compostos para queries complexas
jobSchema.index({ status: 1, 'quality.isQualityJob': 1 });
jobSchema.index({ industry: 1, workModel: 1 });
jobSchema.index({ 'quality.score': -1 });
jobSchema.index({ createdAt: -1 });
// Índice de texto para busca full-text
jobSchema.index({
    title: 'text',
    description: 'text',
    company: 'text',
    keywords: 'text',
});
// Método: Verificar se vaga está ativa
jobSchema.methods.isActive = function () {
    return this.status === 'active' && (!this.expiresAt || this.expiresAt > new Date());
};
const Job = mongoose_1.default.model('Job', jobSchema);
exports.default = Job;
//# sourceMappingURL=Job.js.map
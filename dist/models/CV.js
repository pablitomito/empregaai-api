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
const cvSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    cvData: {
        personalInfo: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: String,
            location: String,
            profilePhoto: String,
        },
        professionalSummary: String,
        experiences: [mongoose_1.Schema.Types.Mixed],
        education: [mongoose_1.Schema.Types.Mixed],
        skills: [String],
        languages: [mongoose_1.Schema.Types.Mixed],
        projects: [mongoose_1.Schema.Types.Mixed],
    },
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Job',
    },
    jobTitle: String,
    companyName: String,
    generatedContent: {
        optimizedSummary: String,
        coverLetter: String,
        keywords: [String],
    },
    pdfUrl: String,
    pdfFileName: String,
    template: {
        type: String,
        enum: ['modern', 'classic', 'minimal', 'creative'],
        default: 'modern',
    },
    language: {
        type: String,
        enum: ['pt', 'en', 'es'],
        default: 'pt',
    },
    status: {
        type: String,
        enum: ['draft', 'generated', 'sent', 'failed'],
        default: 'draft',
    },
    sentAt: Date,
}, {
    timestamps: true,
});
// Índices
cvSchema.index({ userId: 1, createdAt: -1 });
cvSchema.index({ status: 1 });
cvSchema.index({ jobId: 1 });
const CV = mongoose_1.default.model('CV', cvSchema);
exports.default = CV;
//# sourceMappingURL=CV.js.map
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
const applicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true,
    },
    cvId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'CV',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'viewed', 'interview', 'rejected', 'accepted', 'failed'],
        default: 'pending',
        index: true,
    },
    sentAt: Date,
    sentVia: {
        type: String,
        enum: ['email', 'api', 'manual'],
        default: 'email',
    },
    recipientEmail: String,
    tracking: {
        opened: Date,
        clicked: Date,
        replied: Date,
    },
    statusHistory: [
        {
            status: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
            note: String,
        },
    ],
    userNotes: String,
    error: {
        message: String,
        code: String,
        occurredAt: Date,
    },
}, {
    timestamps: true,
});
// Índices compostos
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true }); // Previne candidaturas duplicadas
// Middleware: Adicionar ao histórico quando status mudar
applicationSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            date: new Date(),
        });
    }
    next();
});
const Application = mongoose_1.default.model('Application', applicationSchema);
exports.default = Application;
//# sourceMappingURL=Application.js.map
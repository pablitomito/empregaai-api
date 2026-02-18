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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    // Autenticação
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, forneça um email válido'],
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
        select: false, // Não retorna senha por padrão nas queries
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Permite null/undefined sem conflito de unique
    },
    // Dados pessoais
    fullName: {
        type: String,
        required: [true, 'Nome completo é obrigatório'],
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    profilePhoto: {
        type: String, // URL da foto no Cloudinary
    },
    // Questionário
    objective: {
        type: String,
        enum: ['urgent_job', 'change_career'],
    },
    currentProfession: String,
    isHappyWithJob: {
        type: String,
        enum: ['yes', 'no', 'maybe'],
    },
    interestedAreas: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length <= 3;
            },
            message: 'Você pode selecionar no máximo 3 áreas',
        },
    },
    preferredWorkModel: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
    },
    availableWorkModels: {
        type: [String],
        enum: ['remote', 'hybrid', 'onsite', 'all'],
    },
    // Resumo
    professionalSummary: String,
    personalDescription: {
        type: String,
        minlength: [100, 'A descrição pessoal deve ter no mínimo 100 caracteres'],
    },
    hobbies: String,
    goals: String,
    // Arrays de dados profissionais
    experiences: [
        {
            position: { type: String, required: true },
            company: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: String,
            isCurrentJob: { type: Boolean, default: false },
            description: { type: String, required: true },
        },
    ],
    education: [
        {
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            startYear: { type: String, required: true },
            endYear: String,
        },
    ],
    skills: [String],
    languages: [
        {
            language: { type: String, required: true },
            proficiency: {
                type: String,
                enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'],
                required: true,
            },
        },
    ],
    projects: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            link: String,
        },
    ],
    // Assinatura
    subscription: {
        status: {
            type: String,
            enum: ['free', 'premium', 'cancelled', 'expired'],
            default: 'free',
        },
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        cancelAtPeriodEnd: { type: Boolean, default: false },
    },
    // Estatísticas
    stats: {
        cvGenerated: { type: Number, default: 0 },
        jobsApplied: { type: Number, default: 0 },
        lastJobApplicationDate: Date,
        interviewsScheduled: { type: Number, default: 0 },
        jobsObtained: { type: Boolean, default: false },
    },
    // Controle
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Índices para performance
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });
// Middleware: Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    if (this.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    next();
});
// Método: Comparar senha
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Método: Verificar se perfil está completo
userSchema.methods.hasCompletedProfile = function () {
    return !!(this.fullName &&
        this.phone &&
        this.location &&
        this.objective &&
        this.interestedAreas &&
        this.interestedAreas.length > 0 &&
        this.preferredWorkModel &&
        this.personalDescription &&
        this.experiences &&
        this.experiences.length > 0);
};
// Método: Verificar se é premium
userSchema.methods.isPremium = function () {
    return this.subscription.status === 'premium';
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map
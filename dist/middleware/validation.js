"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalDescriptionSchema = exports.languageSchema = exports.educationSchema = exports.experienceSchema = exports.onboardingStep3Schema = exports.onboardingStep2Schema = exports.onboardingStep1Schema = exports.loginSchema = exports.registerSchema = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
// Middleware genérico de validação
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Erro de validação',
                errors,
            });
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
// ============================================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================================
// Schema: Registro
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    fullName: joi_1.default.string().min(3).required(),
});
// Schema: Login
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
// Schema: Onboarding Step 1
exports.onboardingStep1Schema = joi_1.default.object({
    objective: joi_1.default.string().valid('urgent_job', 'change_career').required(),
    currentProfession: joi_1.default.string().when('objective', {
        is: 'change_career',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    isHappyWithJob: joi_1.default.string().valid('yes', 'no', 'maybe').when('objective', {
        is: 'change_career',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
});
// Schema: Onboarding Step 2
exports.onboardingStep2Schema = joi_1.default.object({
    interestedAreas: joi_1.default.array().items(joi_1.default.string()).min(1).max(3).required(),
});
// Schema: Onboarding Step 3
exports.onboardingStep3Schema = joi_1.default.object({
    preferredWorkModel: joi_1.default.string().valid('remote', 'hybrid', 'onsite').required(),
    availableWorkModels: joi_1.default.array()
        .items(joi_1.default.string().valid('remote', 'hybrid', 'onsite', 'all'))
        .min(1)
        .required(),
});
// Schema: Experiência
exports.experienceSchema = joi_1.default.object({
    position: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    startDate: joi_1.default.string().pattern(/^\d{2}\/\d{4}$/).required(),
    endDate: joi_1.default.string().pattern(/^\d{2}\/\d{4}$/).allow('', null).optional(),
    isCurrentJob: joi_1.default.boolean().default(false),
    description: joi_1.default.string().required(),
});
// Schema: Formação
exports.educationSchema = joi_1.default.object({
    degree: joi_1.default.string().required(),
    institution: joi_1.default.string().required(),
    startYear: joi_1.default.string().pattern(/^\d{4}$/).required(),
    endYear: joi_1.default.string().pattern(/^\d{4}$/).allow('', null).optional(),
});
// Schema: Idioma
exports.languageSchema = joi_1.default.object({
    language: joi_1.default.string().required(),
    proficiency: joi_1.default.string()
        .valid('native', 'fluent', 'advanced', 'intermediate', 'basic')
        .required(),
});
// Schema: Descrição pessoal
exports.personalDescriptionSchema = joi_1.default.object({
    personalDescription: joi_1.default.string().min(100).required(),
    hobbies: joi_1.default.string().optional(),
    goals: joi_1.default.string().optional(),
});
//# sourceMappingURL=validation.js.map
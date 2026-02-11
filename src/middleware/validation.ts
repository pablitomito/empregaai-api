import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Middleware genérico de validação
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

// ============================================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================================

// Schema: Registro
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(3).required(),
});

// Schema: Login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schema: Onboarding Step 1
export const onboardingStep1Schema = Joi.object({
  objective: Joi.string().valid('urgent_job', 'change_career').required(),
  currentProfession: Joi.string().when('objective', {
    is: 'change_career',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  isHappyWithJob: Joi.string().valid('yes', 'no', 'maybe').when('objective', {
    is: 'change_career',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

// Schema: Onboarding Step 2
export const onboardingStep2Schema = Joi.object({
  interestedAreas: Joi.array().items(Joi.string()).min(1).max(3).required(),
});

// Schema: Onboarding Step 3
export const onboardingStep3Schema = Joi.object({
  preferredWorkModel: Joi.string().valid('remote', 'hybrid', 'onsite').required(),
  availableWorkModels: Joi.array()
    .items(Joi.string().valid('remote', 'hybrid', 'onsite', 'all'))
    .min(1)
    .required(),
});

// Schema: Experiência
export const experienceSchema = Joi.object({
  position: Joi.string().required(),
  company: Joi.string().required(),
  startDate: Joi.string().pattern(/^\d{2}\/\d{4}$/).required(),
  endDate: Joi.string().pattern(/^\d{2}\/\d{4}$/).allow('', null).optional(),
  isCurrentJob: Joi.boolean().default(false),
  description: Joi.string().required(),
});

// Schema: Formação
export const educationSchema = Joi.object({
  degree: Joi.string().required(),
  institution: Joi.string().required(),
  startYear: Joi.string().pattern(/^\d{4}$/).required(),
  endYear: Joi.string().pattern(/^\d{4}$/).allow('', null).optional(),
});

// Schema: Idioma
export const languageSchema = Joi.object({
  language: Joi.string().required(),
  proficiency: Joi.string()
    .valid('native', 'fluent', 'advanced', 'intermediate', 'basic')
    .required(),
});

// Schema: Descrição pessoal
export const personalDescriptionSchema = Joi.object({
  personalDescription: Joi.string().min(100).required(),
  hobbies: Joi.string().optional(),
  goals: Joi.string().optional(),
});

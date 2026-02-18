import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const onboardingStep1Schema: Joi.ObjectSchema<any>;
export declare const onboardingStep2Schema: Joi.ObjectSchema<any>;
export declare const onboardingStep3Schema: Joi.ObjectSchema<any>;
export declare const experienceSchema: Joi.ObjectSchema<any>;
export declare const educationSchema: Joi.ObjectSchema<any>;
export declare const languageSchema: Joi.ObjectSchema<any>;
export declare const personalDescriptionSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=validation.d.ts.map
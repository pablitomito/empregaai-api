import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    googleId?: string;
    fullName: string;
    phone?: string;
    location?: string;
    profilePhoto?: string;
    objective?: 'urgent_job' | 'change_career';
    currentProfession?: string;
    isHappyWithJob?: 'yes' | 'no' | 'maybe';
    interestedAreas?: string[];
    preferredWorkModel?: 'remote' | 'hybrid' | 'onsite';
    availableWorkModels?: ('remote' | 'hybrid' | 'onsite' | 'all')[];
    professionalSummary?: string;
    personalDescription?: string;
    hobbies?: string;
    goals?: string;
    experiences?: {
        position: string;
        company: string;
        startDate: string;
        endDate?: string;
        isCurrentJob: boolean;
        description: string;
    }[];
    education?: {
        degree: string;
        institution: string;
        startYear: string;
        endYear?: string;
    }[];
    skills?: string[];
    languages?: {
        language: string;
        proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
    }[];
    projects?: {
        title: string;
        description: string;
        link?: string;
    }[];
    subscription: {
        status: 'free' | 'premium' | 'cancelled' | 'expired';
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
    };
    stats: {
        cvGenerated: number;
        jobsApplied: number;
        lastJobApplicationDate?: Date;
        interviewsScheduled?: number;
        jobsObtained?: boolean;
    };
    isActive: boolean;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    hasCompletedProfile(): boolean;
    isPremium(): boolean;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map
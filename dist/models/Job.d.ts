import mongoose, { Document } from 'mongoose';
export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    workModel: 'remote' | 'hybrid' | 'onsite';
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits?: string[];
    contractType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    industry: string;
    keywords: string[];
    salary?: {
        min?: number;
        max?: number;
        currency: string;
        period: 'hourly' | 'monthly' | 'yearly';
    };
    source: 'indeed' | 'linkedin' | 'net-empregos' | 'sapo-emprego' | 'manual' | 'scraping';
    externalId?: string;
    externalUrl?: string;
    quality: {
        score: number;
        isQualityJob: boolean;
        isEmergencyJob: boolean;
    };
    status: 'active' | 'filled' | 'expired' | 'closed';
    postedDate?: Date;
    expiresAt?: Date;
    stats: {
        views: number;
        applications: number;
        matches: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const Job: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, {}> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Job;
//# sourceMappingURL=Job.d.ts.map
import mongoose, { Document, Types } from 'mongoose';
export interface ICV extends Document {
    userId: Types.ObjectId;
    cvData: {
        personalInfo: {
            fullName: string;
            email: string;
            phone?: string;
            location?: string;
            profilePhoto?: string;
        };
        professionalSummary?: string;
        experiences: any[];
        education: any[];
        skills: string[];
        languages: any[];
        projects?: any[];
    };
    jobId?: Types.ObjectId;
    jobTitle?: string;
    companyName?: string;
    generatedContent: {
        optimizedSummary?: string;
        coverLetter?: string;
        keywords?: string[];
    };
    pdfUrl?: string;
    pdfFileName?: string;
    template: 'modern' | 'classic' | 'minimal' | 'creative';
    language: 'pt' | 'en' | 'es';
    status: 'draft' | 'generated' | 'sent' | 'failed';
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const CV: mongoose.Model<ICV, {}, {}, {}, mongoose.Document<unknown, {}, ICV, {}, {}> & ICV & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default CV;
//# sourceMappingURL=CV.d.ts.map
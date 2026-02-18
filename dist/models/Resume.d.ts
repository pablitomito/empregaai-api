import mongoose, { Document } from 'mongoose';
export interface IResume extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    template: string;
    content: any;
    pdfUrl?: string;
    isPremium: boolean;
    generatedByAI: boolean;
    appliedJobsCount: number;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Resume: mongoose.Model<IResume, {}, {}, {}, mongoose.Document<unknown, {}, IResume, {}, {}> & IResume & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Resume;
//# sourceMappingURL=Resume.d.ts.map
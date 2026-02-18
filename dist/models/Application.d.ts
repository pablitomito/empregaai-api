import mongoose, { Document, Types } from 'mongoose';
export interface IApplication extends Document {
    userId: Types.ObjectId;
    jobId: Types.ObjectId;
    cvId: Types.ObjectId;
    status: 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected' | 'accepted' | 'failed';
    sentAt?: Date;
    sentVia: 'email' | 'api' | 'manual';
    recipientEmail?: string;
    tracking: {
        opened?: Date;
        clicked?: Date;
        replied?: Date;
    };
    statusHistory: {
        status: string;
        date: Date;
        note?: string;
    }[];
    userNotes?: string;
    error?: {
        message: string;
        code?: string;
        occurredAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const Application: mongoose.Model<IApplication, {}, {}, {}, mongoose.Document<unknown, {}, IApplication, {}, {}> & IApplication & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Application;
//# sourceMappingURL=Application.d.ts.map
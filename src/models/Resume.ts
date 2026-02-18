import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: string;              // ex: 'modern-european'
  content: any;                  // JSON estruturado ou HTML
  pdfUrl?: string;               // URL do PDF gerado (Cloudinary ou local)
  isPremium: boolean;            // se o template é premium
  generatedByAI: boolean;        // se foi gerado pela IA
  appliedJobsCount: number;      // quantas vagas foram aplicadas com este CV
  lastUsedAt?: Date;             // última vez que o CV foi usado
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: 'Meu Currículo',
      trim: true,
    },

    template: {
      type: String,
      required: true,
    },

    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    pdfUrl: {
      type: String,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    generatedByAI: {
      type: Boolean,
      default: true,
    },

    appliedJobsCount: {
      type: Number,
      default: 0,
    },

    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
export default Resume;

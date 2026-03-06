import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICV extends Document {
  userId: Types.ObjectId;

  // ── Metadados ──────────────────────────────────────────────────────────────
  title: string;                // ex: "CV para Ryanair"
  isPremium: boolean;           // se o template é premium
  generatedByAI: boolean;       // se foi gerado pela IA
  appliedJobsCount: number;     // quantas candidaturas usaram este CV
  lastUsedAt?: Date;

  // ── Dados estruturados do CV ───────────────────────────────────────────────
  cvData: {
    personalInfo: {
      fullName: string;
      email: string;
      phone?: string;
      location?: string;
      profilePhoto?: string;
    };
    professionalSummary?: string;
    experiences: {
      id?: string;
      company: string;
      position: string;
      description: string;
      startMonth?: string;
      startYear?: string;
      endMonth?: string;
      endYear?: string;
      current: boolean;
    }[];
    education: {
      degree: string;
      institution: string;
      startYear?: string;
      endYear?: string;
    }[];
    skills: string[];
    languages: {
      language: string;
      proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
    }[];
    projects?: {
      title: string;
      description: string;
      link?: string;
    }[];
  };

  // ── Vaga relacionada (opcional) ────────────────────────────────────────────
  jobId?: Types.ObjectId;
  jobTitle?: string;
  companyName?: string;

  // ── Conteúdo gerado pela IA ────────────────────────────────────────────────
  generatedContent: {
    optimizedSummary?: string;
    coverLetter?: string;
    keywords?: string[];
  };

  // ── PDF ───────────────────────────────────────────────────────────────────
  pdfUrl?: string;
  pdfFileName?: string;

  // ── Template & configurações ──────────────────────────────────────────────
  // Alinhado com os templates reais em cv-generator/templates/
  template: 'executivo' | 'tech-modern' | 'minimalista' | 'criativo' | 'ats-optimized';
  language: 'pt' | 'en' | 'es';

  // ── Status ────────────────────────────────────────────────────────────────
  status: 'draft' | 'generated' | 'sent' | 'failed';
  sentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const cvSchema = new Schema<ICV>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Metadados
    title: {
      type: String,
      default: 'Meu Currículo',
      trim: true,
    },
    isPremium: { type: Boolean, default: false },
    generatedByAI: { type: Boolean, default: true },
    appliedJobsCount: { type: Number, default: 0 },
    lastUsedAt: Date,

    // Dados do CV
    cvData: {
      personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        location: String,
        profilePhoto: String,
      },
      professionalSummary: String,
      experiences: [
        {
          id: String,
          company: String,
          position: String,
          description: String,
          startMonth: String,
          startYear: String,
          endMonth: String,
          endYear: String,
          current: { type: Boolean, default: false },
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          startYear: String,
          endYear: String,
        },
      ],
      skills: [String],
      languages: [
        {
          language: String,
          proficiency: {
            type: String,
            enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'],
          },
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          link: String,
        },
      ],
    },

    // Vaga relacionada
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: String,
    companyName: String,

    // Conteúdo IA
    generatedContent: {
      optimizedSummary: String,
      coverLetter: String,
      keywords: [String],
    },

    // PDF
    pdfUrl: String,
    pdfFileName: String,

    // Template — enum alinhado com cv-generator/templates/
    template: {
      type: String,
      enum: ['executivo', 'tech-modern', 'minimalista', 'criativo', 'ats-optimized'],
      default: 'minimalista',
    },

    language: {
      type: String,
      enum: ['pt', 'en', 'es'],
      default: 'pt',
    },

    status: {
      type: String,
      enum: ['draft', 'generated', 'sent', 'failed'],
      default: 'draft',
    },

    sentAt: Date,
  },
  { timestamps: true }
);

cvSchema.index({ userId: 1, createdAt: -1 });
cvSchema.index({ status: 1 });
cvSchema.index({ jobId: 1 });

const CV = mongoose.model<ICV>('CV', cvSchema);
export default CV;
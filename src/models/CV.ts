import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICV extends Document {
  userId: Types.ObjectId;
  
  // Dados do CV
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
  
  // Vaga relacionada (se foi para uma vaga específica)
  jobId?: Types.ObjectId;
  jobTitle?: string;
  companyName?: string;
  
  // Conteúdo gerado pela IA
  generatedContent: {
    optimizedSummary?: string; // Resumo otimizado para a vaga
    coverLetter?: string; // Carta de apresentação
    keywords?: string[]; // Palavras-chave ATS
  };
  
  // Arquivo PDF
  pdfUrl?: string; // URL do PDF no Cloudinary ou S3
  pdfFileName?: string;
  
  // Metadados
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  language: 'pt' | 'en' | 'es';
  
  // Status
  status: 'draft' | 'generated' | 'sent' | 'failed';
  sentAt?: Date;
  
  // Timestamps
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
    
    cvData: {
      personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        location: String,
        profilePhoto: String,
      },
      professionalSummary: String,
      experiences: [Schema.Types.Mixed],
      education: [Schema.Types.Mixed],
      skills: [String],
      languages: [Schema.Types.Mixed],
      projects: [Schema.Types.Mixed],
    },
    
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    jobTitle: String,
    companyName: String,
    
    generatedContent: {
      optimizedSummary: String,
      coverLetter: String,
      keywords: [String],
    },
    
    pdfUrl: String,
    pdfFileName: String,
    
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'creative'],
      default: 'modern',
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
  {
    timestamps: true,
  }
);

// Índices
cvSchema.index({ userId: 1, createdAt: -1 });
cvSchema.index({ status: 1 });
cvSchema.index({ jobId: 1 });

const CV = mongoose.model<ICV>('CV', cvSchema);

export default CV;

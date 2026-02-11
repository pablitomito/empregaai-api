import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  // Informações básicas da vaga
  title: string;
  company: string;
  location: string;
  workModel: 'remote' | 'hybrid' | 'onsite';
  
  // Descrição
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  
  // Detalhes
  contractType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string;
  keywords: string[];
  
  // Salário (opcional)
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  
  // Origem da vaga
  source: 'indeed' | 'linkedin' | 'net-empregos' | 'sapo-emprego' | 'manual' | 'scraping';
  externalId?: string;
  externalUrl?: string;
  
  // Matching e qualidade
  quality: {
    score: number; // 0-100
    isQualityJob: boolean; // Se é uma vaga boa (não emergente)
    isEmergencyJob: boolean; // Restauração, obras, limpeza
  };
  
  // Status
  status: 'active' | 'filled' | 'expired' | 'closed';
  postedDate?: Date;
  expiresAt?: Date;
  
  // Estatísticas
  stats: {
    views: number;
    applications: number;
    matches: number; // Quantos usuários fizeram match
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Título da vaga é obrigatório'],
      trim: true,
      index: true,
    },
    
    company: {
      type: String,
      required: [true, 'Nome da empresa é obrigatório'],
      trim: true,
      index: true,
    },
    
    location: {
      type: String,
      required: true,
      trim: true,
    },
    
    workModel: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: true,
    },
    
    description: {
      type: String,
      required: true,
    },
    
    requirements: [String],
    responsibilities: [String],
    benefits: [String],
    
    contractType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      default: 'full-time',
    },
    
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
      default: 'entry',
    },
    
    industry: {
      type: String,
      required: true,
      index: true,
    },
    
    keywords: [String],
    
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'EUR' },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'monthly',
      },
    },
    
    source: {
      type: String,
      enum: ['indeed', 'linkedin', 'net-empregos', 'sapo-emprego', 'manual', 'scraping'],
      required: true,
    },
    
    externalId: String,
    externalUrl: String,
    
    quality: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      isQualityJob: {
        type: Boolean,
        default: true,
      },
      isEmergencyJob: {
        type: Boolean,
        default: false,
      },
    },
    
    status: {
      type: String,
      enum: ['active', 'filled', 'expired', 'closed'],
      default: 'active',
      index: true,
    },
    
    postedDate: Date,
    expiresAt: Date,
    
    stats: {
      views: { type: Number, default: 0 },
      applications: { type: Number, default: 0 },
      matches: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Índices compostos para queries complexas
jobSchema.index({ status: 1, 'quality.isQualityJob': 1 });
jobSchema.index({ industry: 1, workModel: 1 });
jobSchema.index({ 'quality.score': -1 });
jobSchema.index({ createdAt: -1 });

// Índice de texto para busca full-text
jobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  keywords: 'text',
});

// Método: Verificar se vaga está ativa
jobSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && (!this.expiresAt || this.expiresAt > new Date());
};

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;

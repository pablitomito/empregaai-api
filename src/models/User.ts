import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface TypeScript para o User
export interface IUser extends Document {
  // Dados de autenticação
  email: string;
  password: string;
  googleId?: string;
  
  // Dados pessoais
  fullName: string;
  phone?: string;
  location?: string;
  profilePhoto?: string;
  
  // Questionário de perfil
  objective?: 'urgent_job' | 'change_career';
  currentProfession?: string;
  isHappyWithJob?: 'yes' | 'no' | 'maybe';
  interestedAreas?: string[]; // Máximo 3
  preferredWorkModel?: 'remote' | 'hybrid' | 'onsite';
  availableWorkModels?: ('remote' | 'hybrid' | 'onsite' | 'all')[];
  
  // Resumo profissional
  professionalSummary?: string;
  personalDescription?: string; // Mínimo 100 caracteres
  hobbies?: string;
  goals?: string;
  
  // Experiências profissionais
  experiences?: {
    position: string;
    company: string;
    startDate: string; // MM/YYYY
    endDate?: string; // MM/YYYY
    isCurrentJob: boolean;
    description: string;
  }[];
  
  // Formação acadêmica
  education?: {
    degree: string;
    institution: string;
    startYear: string;
    endYear?: string;
  }[];
  
  // Habilidades e idiomas
  skills?: string[];
  languages?: {
    language: string;
    proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  }[];
  
  // Projetos (opcional)
  projects?: {
    title: string;
    description: string;
    link?: string;
  }[];
  
  // Assinatura e pagamentos
  subscription: {
    status: 'free' | 'premium' | 'cancelled' | 'expired';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
  
  // Estatísticas
  stats: {
    cvGenerated: number; // Total de CVs gerados
    jobsApplied: number; // Total de candidaturas enviadas
    lastJobApplicationDate?: Date;
    interviewsScheduled?: number;
    jobsObtained?: boolean; // Se conseguiu emprego
  };
  
  // Controle
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasCompletedProfile(): boolean;
  isPremium(): boolean;
}

const userSchema = new Schema<IUser>(
  {
    // Autenticação
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, forneça um email válido'],
    },
    password: {
      type: String,
      required: function (this: any): boolean {
  return !this.googleId;
}
,
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
      select: false, // Não retorna senha por padrão nas queries
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Permite null/undefined sem conflito de unique
    },
    
    // Dados pessoais
    fullName: {
      type: String,
      required: [true, 'Nome completo é obrigatório'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String, // URL da foto no Cloudinary
    },
    
    // Questionário
    objective: {
      type: String,
      enum: ['urgent_job', 'change_career'],
    },
    currentProfession: String,
    isHappyWithJob: {
      type: String,
      enum: ['yes', 'no', 'maybe'],
    },
    interestedAreas: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 3;
        },
        message: 'Você pode selecionar no máximo 3 áreas',
      },
    },
    preferredWorkModel: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
    },
    availableWorkModels: {
      type: [String],
      enum: ['remote', 'hybrid', 'onsite', 'all'],
    },
    
    // Resumo
    professionalSummary: String,
    personalDescription: {
      type: String,
      minlength: [100, 'A descrição pessoal deve ter no mínimo 100 caracteres'],
    },
    hobbies: String,
    goals: String,
    
    // Arrays de dados profissionais
    experiences: [
      {
        position: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: String,
        isCurrentJob: { type: Boolean, default: false },
        description: { type: String, required: true },
      },
    ],
    
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startYear: { type: String, required: true },
        endYear: String,
      },
    ],
    
    skills: [String],
    
    languages: [
      {
        language: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'],
          required: true,
        },
      },
    ],
    
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: String,
      },
    ],
    
    // Assinatura
    subscription: {
      status: {
        type: String,
        enum: ['free', 'premium', 'cancelled', 'expired'],
        default: 'free',
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: { type: Boolean, default: false },
    },
    
    // Estatísticas
    stats: {
      cvGenerated: { type: Number, default: 0 },
      jobsApplied: { type: Number, default: 0 },
      lastJobApplicationDate: Date,
      interviewsScheduled: { type: Number, default: 0 },
      jobsObtained: { type: Boolean, default: false },
    },
    
    // Controle
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });

// Middleware: Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Método: Comparar senha
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método: Verificar se perfil está completo
userSchema.methods.hasCompletedProfile = function(): boolean {
  return !!(
    this.fullName &&
    this.phone &&
    this.location &&
    this.objective &&
    this.interestedAreas &&
    this.interestedAreas.length > 0 &&
    this.preferredWorkModel &&
    this.personalDescription &&
    this.experiences &&
    this.experiences.length > 0
  );
};

// Método: Verificar se é premium
userSchema.methods.isPremium = function(): boolean {
  return this.subscription.status === 'premium';
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  cvId: Types.ObjectId;
  
  // Status da candidatura
  status: 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected' | 'accepted' | 'failed';
  
  // Dados do envio
  sentAt?: Date;
  sentVia: 'email' | 'api' | 'manual';
  recipientEmail?: string;
  
  // Tracking
  tracking: {
    opened?: Date; // Quando o email foi aberto
    clicked?: Date; // Quando clicaram no CV
    replied?: Date; // Quando responderam
  };
  
  // Histórico de status
  statusHistory: {
    status: string;
    date: Date;
    note?: string;
  }[];
  
  // Notas do usuário
  userNotes?: string;
  
  // Erro (se falhou)
  error?: {
    message: string;
    code?: string;
    occurredAt: Date;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    
    cvId: {
      type: Schema.Types.ObjectId,
      ref: 'CV',
      required: true,
    },
    
    status: {
      type: String,
      enum: ['pending', 'sent', 'viewed', 'interview', 'rejected', 'accepted', 'failed'],
      default: 'pending',
      index: true,
    },
    
    sentAt: Date,
    
    sentVia: {
      type: String,
      enum: ['email', 'api', 'manual'],
      default: 'email',
    },
    
    recipientEmail: String,
    
    tracking: {
      opened: Date,
      clicked: Date,
      replied: Date,
    },
    
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    
    userNotes: String,
    
    error: {
      message: String,
      code: String,
      occurredAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices compostos
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true }); // Previne candidaturas duplicadas

// Middleware: Adicionar ao histórico quando status mudar
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
    });
  }
  next();
});

const Application = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;

import { Request, Response } from 'express';
import { generateCVPDF } from '../services/cv-generator/generator';
import { uploadCVToR2 } from '../services/storage/r2-client';
import { sendCVEmail } from '../services/email/sender';
import { UserCVData } from '../services/cv-generator/types';

export async function generateCV(req: Request, res: Response) {
  try {
    const { 
      userData, 
      userId,
      sendEmail = false 
    }: { 
      userData: UserCVData; 
      userId: string;
      sendEmail?: boolean;
    } = req.body;
    
    if (!userData || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userData e userId são obrigatórios' 
      });
    }
    
    console.log(`📋 Requisição de CV para: ${userData.name}`);
    
    // 1. Gera PDF
    console.log('🎨 Gerando PDF...');
    const pdfBuffer = await generateCVPDF(userData);
    
    // 2. Upload para R2
    console.log('☁️ Fazendo upload para R2...');
    const pdfUrl = await uploadCVToR2(pdfBuffer, userId);
    
    // 3. Envia email (se solicitado)
    if (sendEmail) {
      console.log('📧 Enviando email...');
      await sendCVEmail(
        userData.email, 
        userData.name, 
        pdfUrl,
        pdfBuffer // Anexa o PDF ao email
      );
    }
    
    console.log(`✅ CV gerado com sucesso: ${pdfUrl}`);
    
    return res.json({
      success: true,
      pdfUrl,
      message: 'CV gerado com sucesso!',
      emailSent: sendEmail
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao gerar CV:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export function listTemplates(req: Request, res: Response) {
  const templates = [
    { 
      id: 'executivo', 
      name: 'Executivo', 
      category: 'Formal',
      description: 'Ideal para cargos de gestão e liderança'
    },
    { 
      id: 'tech-modern', 
      name: 'Tech Modern', 
      category: 'Tecnologia',
      description: 'Perfeito para profissionais de TI'
    },
    { 
      id: 'minimalista', 
      name: 'Minimalista', 
      category: 'Clean',
      description: 'Design limpo para qualquer área'
    },
    { 
      id: 'criativo', 
      name: 'Criativo', 
      category: 'Design',
      description: 'Para designers e criativos'
    },
    { 
      id: 'ats-optimized', 
      name: 'ATS Optimized', 
      category: 'Robôs',
      description: 'Otimizado para filtros automáticos'
    }
  ];
  
  return res.json({ 
    success: true,
    templates,
    total: templates.length
  });
}
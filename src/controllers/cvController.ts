import { Request, Response } from 'express';
import { generateCVPDF } from '../services/cv-generator/generator';
import { uploadCVToR2 } from '../services/storage/r2-client';
import { sendCVEmail } from '../services/email/sender';
import { UserCVData } from '../services/cv-generator/types';

// Gerar CV
export async function generateCV(req: Request, res: Response) {
  try {
    const { userData, userId }: { userData: UserCVData; userId: string } = req.body;
    
    if (!userData || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userData e userId são obrigatórios' 
      });
    }
    
    console.log(`📋 Requisição de CV para: ${userData.name}`);
    
    // 1. Gera PDF
    const pdfBuffer = await generateCVPDF(userData);
    
    // 2. Upload para R2
    const pdfUrl = await uploadCVToR2(pdfBuffer, userId);
    
    // 3. Envia email
    await sendCVEmail(userData.email, userData.name, pdfUrl);
    
    console.log(`✅ CV gerado e enviado: ${pdfUrl}`);
    
    return res.json({
      success: true,
      pdfUrl,
      message: 'CV gerado com sucesso!'
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao gerar CV:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
// 🆕 Gerar CV com template específico (para testes)
export async function generateCVWithTemplate(req: Request, res: Response) {
  try {
    const { userData, userId, templateId } = req.body;
    
    if (!userData || !userId || !templateId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userData, userId e templateId são obrigatórios' 
      });
    }
    
    console.log(`📋 Gerando CV com template: ${templateId}`);
    
    // Força o uso de um template específico
    // (você precisaria adaptar o generator para aceitar templateId)
    
    const pdfBuffer = await generateCVPDF(userData);
    const pdfUrl = await uploadCVToR2(pdfBuffer, userId);
    
    return res.json({
      success: true,
      pdfUrl,
      template: templateId,
      message: `CV gerado com template ${templateId}!`
    });
    
  } catch (error: any) {
    console.error('❌ Erro:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
// 🆕 Listar templates disponíveis
export function listTemplates(req: Request, res: Response) {
  const templates = [
    { 
      id: 'executivo', 
      name: 'Executivo', 
      category: 'Formal',
      description: 'Ideal para cargos de gestão e liderança',
      preview: '/previews/executivo.png'
    },
    { 
      id: 'tech-modern', 
      name: 'Tech Modern', 
      category: 'Tecnologia',
      description: 'Perfeito para profissionais de TI e desenvolvimento',
      preview: '/previews/tech-modern.png'
    },
    { 
      id: 'minimalista', 
      name: 'Minimalista', 
      category: 'Clean',
      description: 'Design limpo e elegante para qualquer área',
      preview: '/previews/minimalista.png'
    },
    { 
      id: 'criativo', 
      name: 'Criativo', 
      category: 'Design',
      description: 'Visual impactante para designers e criativos',
      preview: '/previews/criativo.png'
    },
    { 
      id: 'ats-optimized', 
      name: 'ATS Optimized', 
      category: 'Robôs',
      description: 'Otimizado para passar pelos filtros automáticos',
      preview: '/previews/ats-optimized.png'
    }
  ];
  
  return res.json({ 
    success: true,
    templates,
    total: templates.length
  });
}
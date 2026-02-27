import { Request, Response } from 'express';
import { generateCVPDF } from '../services/cv-generator/generator';
import { uploadCVToR2 } from '../services/storage/r2-client';
import { sendCVEmail } from '../services/email/sender';
import { UserCVData } from '../services/cv-generator/types';

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
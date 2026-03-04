import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import CV from '../models/CV';
import User from '../models/User';
import { generateCVPDF } from '../services/cv-generator/generator';
import {
  generateResumeAI,
  generateCoverLetterAI,
  generateProfessionalSummary,
  optimizeATS,
  calculateMatchScore,
} from '../services/aiService';
import { UserCVData } from '../services/cv-generator/types';

// ============================================================================
// Utilitário — mapeia IUser → UserCVData (formato do generator)
// ============================================================================
function mapUserToCV(user: any, aiData: any): UserCVData {
  return {
    name: aiData.fullName || user.fullName,
    email: aiData.email || user.email,
    phone: aiData.phone || user.phone || '',
    location: aiData.address || user.location || '',
    role: user.currentProfession || '',
    summary: aiData.aboutMe || user.professionalSummary || '',
    experiences: (aiData.experiences || []).map((e: any) => ({
      title: e.role,
      company: e.company,
      location: '',
      startDate: e.period?.split('–')[0]?.trim() || '',
      endDate: e.period?.split('–')[1]?.trim() || '',
      current: e.period?.toLowerCase().includes('presente') || false,
      description: e.description,
    })),
    education: (aiData.education || []).map((e: any) => ({
      degree: e.degree,
      institution: e.school,
      location: '',
      year: e.period || '',
    })),
    skills: aiData.skills || user.skills || [],
    languages: (user.languages || []).map((l: any) => ({
      name: l.language,
      level: l.proficiency,
    })),
    industry: user.interestedAreas?.[0] || '',
    experienceYears: user.experiences?.length || 0,
  };
}

// ============================================================================
// POST /api/ai/generate-resume
// Gera CV completo com IA + PDF
// ============================================================================
export const generateResume = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.userId || req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
      return;
    }

    // 1. Claude gera conteúdo otimizado
    const aiData = await generateResumeAI(user);

    // 2. Mapeia para o formato do generator
    const cvData = mapUserToCV(user, aiData);

    // 3. Playwright gera o PDF com o template certo
    const pdfBuffer = await generateCVPDF(cvData);

    // 4. Guarda no MongoDB
    const cv = await CV.create({
      userId: user._id,
      cvData: {
        personalInfo: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          location: user.location,
          profilePhoto: user.profilePhoto,
        },
        professionalSummary: aiData.aboutMe,
        experiences: user.experiences,
        education: user.education,
        skills: user.skills,
        languages: user.languages,
      },
      generatedContent: {
        optimizedSummary: aiData.aboutMe,
        keywords: aiData.skills,
      },
      template: 'modern', // o selector já escolhe internamente
      status: 'generated',
    });

    // 5. Incrementa estatísticas
    user.stats.cvGenerated += 1;
    await user.save();

    // 6. Devolve PDF diretamente ou URL se tiveres R2 configurado
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cv_${user.fullName.replace(/\s/g, '_')}.pdf"`);
    res.send(pdfBuffer);
  }
);

// ============================================================================
// POST /api/ai/cover-letter
// Body: { title, company, description }
// ============================================================================
export const generateCoverLetter = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, company, description } = req.body;

    if (!title || !company || !description) {
      res.status(400).json({
        success: false,
        message: 'title, company e description são obrigatórios.',
      });
      return;
    }

    const user = await User.findById(req.userId || req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
      return;
    }

    const letter = await generateCoverLetterAI(user, { title, company, description });

    res.json({ success: true, letter });
  }
);

// ============================================================================
// POST /api/ai/professional-summary
// Gera ou regenera o resumo profissional do utilizador
// ============================================================================
export const generateSummary = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.userId || req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
      return;
    }

    const summary = await generateProfessionalSummary(user);

    // Guarda no perfil do utilizador
    user.professionalSummary = summary;
    await user.save();

    res.json({ success: true, summary });
  }
);

// ============================================================================
// POST /api/ai/optimize-ats
// Body: { resumeText }
// ============================================================================
export const optimizeResume = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400).json({ success: false, message: 'resumeText é obrigatório.' });
      return;
    }

    const optimized = await optimizeATS(resumeText);

    res.json({ success: true, optimized });
  }
);

// ============================================================================
// POST /api/ai/match-score
// Body: { jobDescription }
// Grátis — sem chamada ao Claude
// ============================================================================
export const getMatchScore = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      res.status(400).json({ success: false, message: 'jobDescription é obrigatório.' });
      return;
    }

    const user = await User.findById(req.userId || req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
      return;
    }

    const result = calculateMatchScore(user, jobDescription);

    res.json({ success: true, ...result });
  }
);
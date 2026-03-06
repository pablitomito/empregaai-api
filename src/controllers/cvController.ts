import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import CV from '../models/CV';
import User from '../models/User';
import { generateCVPDF } from '../services/cv-generator/generator';
import { generateResumeAI } from '../services/aiService';
import { UserCVData } from '../services/cv-generator/types';

// ============================================================================
// Utilitário — mapeia IUser + dados IA → UserCVData para o generator.ts
// ============================================================================
function mapToUserCVData(user: any, aiData: any): UserCVData {
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
// POST /api/cv/generate
// Gera CV com IA + PDF com template — substitui createResume do resumeController
// ============================================================================
export const generateCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.userId || req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
      return;
    }

    // 1. IA gera conteúdo otimizado
    const aiData = await generateResumeAI(user);

    // 2. Mapeia para UserCVData e gera PDF com Playwright
    const cvData = mapToUserCVData(user, aiData);
    const pdfBuffer = await generateCVPDF(cvData);

    // 3. Guarda no MongoDB (CV.ts — modelo unificado)
    const cv = await CV.create({
      userId: user._id,
      title: `CV — ${user.fullName}`,
      generatedByAI: true,
      isPremium: user.isPremium(),
      cvData: {
        personalInfo: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          location: user.location,
          profilePhoto: user.profilePhoto,
        },
        professionalSummary: aiData.aboutMe,
        experiences: user.experiences || [],
        education: user.education || [],
        skills: user.skills || [],
        languages: user.languages || [],
      },
      generatedContent: {
        optimizedSummary: aiData.aboutMe,
        keywords: aiData.skills,
      },
      status: 'generated',
    });

    // 4. Incrementa estatísticas do utilizador
    user.stats.cvGenerated += 1;
    await user.save();

    // 5. Devolve PDF diretamente
    // Quando tiveres R2 configurado, faz upload e devolve a URL em vez do buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cv_${user.fullName.replace(/\s+/g, '_')}.pdf"`
    );
    res.setHeader('X-CV-Id', cv._id.toString()); // ID disponível no header da resposta
    res.send(pdfBuffer);
  }
);

// ============================================================================
// GET /api/cv
// Lista todos os CVs do utilizador
// ============================================================================
export const getMyCVs = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cvs = await CV.find({ userId: req.userId || req.user?._id })
      .sort({ createdAt: -1 })
      .select('-cvData'); // Não devolve os dados completos na listagem

    res.json({ success: true, count: cvs.length, data: cvs });
  }
);

// ============================================================================
// GET /api/cv/latest
// Devolve o CV mais recente — substitui getLatestResume
// ============================================================================
export const getLatestCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cv = await CV.findOne({ userId: req.userId || req.user?._id })
      .sort({ createdAt: -1 });

    if (!cv) {
      res.status(404).json({ success: false, message: 'Nenhum currículo encontrado.' });
      return;
    }

    res.json({ success: true, data: cv });
  }
);

// ============================================================================
// GET /api/cv/:id
// Devolve CV por ID — substitui getResumeById
// ============================================================================
export const getCVById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      res.status(404).json({ success: false, message: 'Currículo não encontrado.' });
      return;
    }

    // Garante que o CV pertence ao utilizador autenticado
    if (cv.userId.toString() !== (req.userId || req.user?._id?.toString())) {
      res.status(403).json({ success: false, message: 'Acesso negado.' });
      return;
    }

    // Atualiza lastUsedAt
    cv.lastUsedAt = new Date();
    await cv.save();

    res.json({ success: true, data: cv });
  }
);

// ============================================================================
// GET /api/cv/:id/download
// Download PDF — premium only (middleware premiumOnly aplicado na route)
// Substitui downloadResumePDF mas usa generator.ts em vez de pdfService
// ============================================================================
export const downloadCVPDF = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      res.status(404).json({ success: false, message: 'Currículo não encontrado.' });
      return;
    }

    if (cv.userId.toString() !== (req.userId || req.user?._id?.toString())) {
      res.status(403).json({ success: false, message: 'Acesso negado.' });
      return;
    }

    // Se já tem PDF em storage, redireciona diretamente
    if (cv.pdfUrl) {
      res.redirect(cv.pdfUrl);
      return;
    }

    // Caso contrário regenera com Playwright
    const cvData = mapToUserCVData(
      { ...cv.cvData.personalInfo, ...req.user },
      {
        fullName: cv.cvData.personalInfo.fullName,
        email: cv.cvData.personalInfo.email,
        phone: cv.cvData.personalInfo.phone,
        address: cv.cvData.personalInfo.location,
        aboutMe: cv.cvData.professionalSummary,
        experiences: (cv.cvData.experiences || []).map((e: any) => ({
          role: e.position,
          company: e.company,
          period: `${e.startMonth || ''} ${e.startYear || ''} – ${e.current ? 'Presente' : `${e.endMonth || ''} ${e.endYear || ''}`}`.trim(),
          description: e.description,
        })),
        education: (cv.cvData.education || []).map((e: any) => ({
          degree: e.degree,
          school: e.institution,
          period: `${e.startYear || ''} – ${e.endYear || ''}`.trim(),
        })),
        skills: cv.cvData.skills,
      }
    );

    const pdfBuffer = await generateCVPDF(cvData);

    // Atualiza stats
    cv.lastUsedAt = new Date();
    cv.appliedJobsCount += 1;
    await cv.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cv_${cv.cvData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf"`
    );
    res.send(pdfBuffer);
  }
);

// ============================================================================
// DELETE /api/cv/:id
// ============================================================================
export const deleteCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      res.status(404).json({ success: false, message: 'Currículo não encontrado.' });
      return;
    }

    if (cv.userId.toString() !== (req.userId || req.user?._id?.toString())) {
      res.status(403).json({ success: false, message: 'Acesso negado.' });
      return;
    }

    await cv.deleteOne();
    res.json({ success: true, message: 'Currículo eliminado.' });
  }
);
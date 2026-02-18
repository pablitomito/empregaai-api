import Resume from "../models/Resume.js";
import User from "../models/User.js";
import { generateResumePDF } from "../services/pdfService.js";

// Criar currículo (usado pela IA)
export const createResume = async (req, res) => {
  try {
    const userId = req.user._id;

    const resume = await Resume.create({
      userId,
      template: "modern-european",
      content: req.body.content,
      generatedByAI: true,
      isPremium: false,
    });

    res.json({
      success: true,
      resumeId: resume._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar currículo." });
  }
};

// Buscar currículo mais recente do usuário
export const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Nenhum currículo encontrado." });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao carregar currículo." });
  }
};

// Buscar currículo por ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Currículo não encontrado." });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Acesso negado." });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao carregar currículo." });
  }
};

// Download PDF (premium only)
export const downloadResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Currículo não encontrado." });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Acesso negado." });
    }

    if (req.user.subscription.status !== "premium") {
      return res.status(403).json({
        success: false,
        message: "Faça upgrade para baixar o currículo.",
      });
    }

    const pdf = generateResumePDF(resume.content);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=curriculo-${resume._id}.pdf`
    );

    pdf.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao gerar PDF." });
  }
};

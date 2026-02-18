"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCoverLetterAI = exports.generateResumeAI = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Resume_1 = __importDefault(require("../models/Resume"));
const User_1 = __importDefault(require("../models/User"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("❌ GROQ_API_KEY não encontrada no .env");
    process.exit(1);
}
const groq = new groq_sdk_1.default({ apiKey });
// GERAR CURRÍCULO COM IA
exports.generateResumeAI = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.default.findById(req.userId || req.user?._id);
    if (!user) {
        res.status(404).json({ success: false, message: "Usuário não encontrado." });
        return;
    }
    const prompt = `
Gere um currículo profissional em JSON com os seguintes dados:

Nome: ${user.fullName}
Email: ${user.email}
Telefone: ${user.phone || ""}
Localização: ${user.location || ""}
Resumo: ${user.professionalSummary || user.personalDescription || ""}

Experiências:
${JSON.stringify(user.experiences || [])}

Educação:
${JSON.stringify(user.education || [])}

Skills:
${JSON.stringify(user.skills || [])}

Formato EXATO do JSON de saída:
{
  "fullName": "",
  "email": "",
  "phone": "",
  "address": "",
  "aboutMe": "",
  "photoUrl": "",
  "experiences": [
    { "company": "", "role": "", "period": "", "description": "" }
  ],
  "education": [
    { "school": "", "degree": "", "period": "" }
  ],
  "skills": []
}
`;
    const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
    });
    const aiText = completion.choices[0].message.content || "{}";
    const json = JSON.parse(aiText);
    const resume = await Resume_1.default.create({
        userId: user._id,
        template: "modern-european",
        content: json,
        generatedByAI: true,
        isPremium: false,
    });
    user.stats.cvGenerated += 1;
    await user.save();
    res.json({
        success: true,
        resumeId: resume._id,
        data: resume,
    });
});
// GERAR CARTA DE APRESENTAÇÃO
exports.generateCoverLetterAI = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, company, description } = req.body;
    const user = await User_1.default.findById(req.userId || req.user?._id);
    if (!user) {
        res.status(404).json({ success: false, message: "Usuário não encontrado." });
        return;
    }
    const prompt = `
Gere uma carta de apresentação profissional para:

Nome: ${user.fullName}
Profissão: ${user.currentProfession || ""}
Empresa alvo: ${company}
Título da vaga: ${title}
Descrição da vaga: ${description}

Formato: texto simples, 3 parágrafos, tom profissional europeu.
`;
    const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });
    const letter = completion.choices[0].message.content || "";
    res.json({
        success: true,
        letter,
    });
});
//# sourceMappingURL=aiController.js.map
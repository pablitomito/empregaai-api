"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumeAI = generateResumeAI;
exports.generateCoverLetterAI = generateCoverLetterAI;
exports.optimizeATS = optimizeATS;
exports.summarizeProfile = summarizeProfile;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
// Utilitário interno
async function askGroq(prompt) {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1500,
    });
    return response.choices[0].message.content;
}
// ============================================================================
// 1. Gerar Currículo com IA
// ============================================================================
async function generateResumeAI(userData) {
    const prompt = `
Gere um currículo profissional em português de Portugal com base nos dados abaixo.
Formato: texto estruturado, sem HTML.

Dados do candidato:
${JSON.stringify(userData, null, 2)}

Regras:
- Tom profissional, claro e direto
- Destaque resultados e conquistas
- Use bullet points quando necessário
- Otimize para ATS
- Não invente informações
`;
    return askGroq(prompt);
}
// ============================================================================
// 2. Gerar Carta de Apresentação
// ============================================================================
async function generateCoverLetterAI(userData, jobData) {
    const prompt = `
Gere uma carta de apresentação profissional em português de Portugal.

Dados do candidato:
${JSON.stringify(userData, null, 2)}

Dados da vaga:
${JSON.stringify(jobData, null, 2)}

Regras:
- Tom humano, educado e confiante
- 3 parágrafos
- Não invente experiência
- Destaque motivação e alinhamento com a vaga
`;
    return askGroq(prompt);
}
// ============================================================================
// 3. Otimização ATS
// ============================================================================
async function optimizeATS(resumeText) {
    const prompt = `
Otimize o currículo abaixo para ATS (Applicant Tracking System).
Melhore palavras-chave, clareza e estrutura.

Currículo:
${resumeText}
`;
    return askGroq(prompt);
}
// ============================================================================
// 4. Resumo Profissional
// ============================================================================
async function summarizeProfile(userData) {
    const prompt = `
Crie um resumo profissional forte e convincente (4-6 linhas) com base nos dados:

${JSON.stringify(userData, null, 2)}

Regras:
- Português de Portugal
- Tom profissional
- Destaque pontos fortes
- Não invente informações
`;
    return askGroq(prompt);
}
//# sourceMappingURL=aiService.js.map
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Utilitário interno
async function askGroq(prompt: string) {
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
export async function generateResumeAI(userData: any) {
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
export async function generateCoverLetterAI(userData: any, jobData: any) {
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
export async function optimizeATS(resumeText: string) {
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
export async function summarizeProfile(userData: any) {
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

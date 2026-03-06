import { IUser } from '../models/User';
import {
  generateAIContent,
  generateResumeJSONPrompt,
  generateCoverLetterPrompt,
  generateProfessionalSummaryPrompt,
  extractATSKeywordsPrompt,
  getMatchAnalysis,
  GROQ_CONFIG,
} from '../config/groq';

// ============================================================================
// Utilitário — extrai JSON de blocos ```json ``` que o Llama às vezes adiciona
// ============================================================================
function extractJSON(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

// ============================================================================
// 1. Gerar CV completo em JSON → usado pelo generator.ts para gerar o PDF
// ============================================================================
export async function generateResumeAI(user: IUser): Promise<{
  fullName: string;
  email: string;
  phone: string;
  address: string;
  aboutMe: string;
  photoUrl: string;
  experiences: { company: string; role: string; period: string; description: string }[];
  education: { school: string; degree: string; period: string }[];
  skills: string[];
}> {
  const raw = await generateAIContent(generateResumeJSONPrompt(user), {
    maxTokens: GROQ_CONFIG.MAX_TOKENS,
  });
  return JSON.parse(extractJSON(raw));
}

// ============================================================================
// 2. Gerar Carta de Apresentação
// ============================================================================
export async function generateCoverLetterAI(
  user: IUser,
  jobData: { title: string; company: string; description: string; requirements?: string[] }
): Promise<string> {
  return generateAIContent(generateCoverLetterPrompt(user, jobData), {
    maxTokens: 1024,
  });
}

// ============================================================================
// 3. Gerar / Regenerar Resumo Profissional
// ============================================================================
export async function generateProfessionalSummary(user: IUser): Promise<string> {
  return generateAIContent(generateProfessionalSummaryPrompt(user), {
    maxTokens: 512,
  });
}

// ============================================================================
// 4. Otimização ATS — recebe texto e devolve versão melhorada
// ============================================================================
export async function optimizeATS(resumeText: string): Promise<string> {
  const prompt = `
<curriculo>
${resumeText}
</curriculo>

<tarefa>
Otimiza este currículo para sistemas ATS (Applicant Tracking Systems).

Regras:
- Usa verbos de ação no início das descrições (liderou, desenvolveu, implementou, aumentou)
- Garante títulos de secção standard: Experiência Profissional, Formação, Competências
- Melhora as palavras-chave sem alterar os factos
- Remove formatação especial que ATS não consegue ler
- Mantém tom profissional e português de Portugal
- Responde apenas com o currículo otimizado, sem comentários
</tarefa>
`;
  return generateAIContent(prompt, { maxTokens: GROQ_CONFIG.MAX_TOKENS });
}

// ============================================================================
// 5. Extração de Keywords ATS de uma descrição de vaga
// ============================================================================
export async function extractKeywordsFromJob(jobDescription: string): Promise<string[]> {
  const raw = await generateAIContent(extractATSKeywordsPrompt(jobDescription), {
    maxTokens: 256,
  });
  return raw.split(',').map((k) => k.trim()).filter(Boolean);
}

// ============================================================================
// 6. Match Score LOCAL — grátis, sem chamada à IA
//    Usa as skills e idiomas do perfil para calcular compatibilidade
// ============================================================================
export function calculateMatchScore(
  user: IUser,
  jobDescription: string
): { score: number; matchedKeywords: string[]; missingKeywords: string[] } {
  const desc = jobDescription.toLowerCase();

  const userKeywords = [
    ...(user.skills || []),
    ...(user.languages || []).map((l) => l.language),
    user.currentProfession || '',
    ...(user.interestedAreas || []),
  ]
    .map((k) => k.toLowerCase())
    .filter(Boolean);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of userKeywords) {
    if (desc.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const score =
    userKeywords.length > 0
      ? Math.min(100, Math.round((matchedKeywords.length / userKeywords.length) * 100))
      : 0;

  return { score, matchedKeywords, missingKeywords };
}

// ============================================================================
// 7. Match Analysis com IA — análise qualitativa completa
//    Usa getMatchAnalysis do config/groq.ts
// ============================================================================
export { getMatchAnalysis as getMatchAnalysisAI } from '../config/groq';
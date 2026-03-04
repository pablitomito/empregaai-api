import claude from '../config/claude';
import { IUser } from '../models/User';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2048;

// ============================================================================
// Utilitário interno — chamada base ao Claude
// ============================================================================
async function askClaude(prompt: string, maxTokens = MAX_TOKENS): Promise<string> {
  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Resposta inesperada do Claude');
  return block.text;
}

// ============================================================================
// Utilitário — extrai JSON de dentro de blocos ```json ... ```
// Claude devolve JSON limpo quando pedido com XML tags, mas por segurança:
// ============================================================================
function extractJSON(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

// ============================================================================
// 1. Gerar Currículo com IA
//    Recebe o utilizador do MongoDB e devolve JSON estruturado para o template
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
  const prompt = `
És um especialista em redação de currículos profissionais para o mercado europeu (Portugal).

Gera um currículo profissional com base nos dados abaixo.
Responde APENAS com JSON válido, sem texto extra, sem markdown.

<dados_candidato>
Nome: ${user.fullName}
Email: ${user.email}
Telefone: ${user.phone || ''}
Localização: ${user.location || ''}
Resumo atual: ${user.professionalSummary || user.personalDescription || ''}
Profissão atual: ${user.currentProfession || ''}
Objetivos: ${user.goals || ''}

Experiências:
${JSON.stringify(user.experiences || [], null, 2)}

Formação:
${JSON.stringify(user.education || [], null, 2)}

Competências:
${JSON.stringify(user.skills || [], null, 2)}

Idiomas:
${JSON.stringify(user.languages || [], null, 2)}
</dados_candidato>

<regras>
- Tom profissional, português de Portugal
- O campo "aboutMe" deve ser um resumo profissional forte de 3-4 linhas
- Reescreve as descrições de experiência com foco em resultados e impacto
- Não inventes informações que não estejam nos dados
- Normaliza os períodos no formato "Jan 2022 – Mar 2024" ou "Jan 2022 – Presente"
- Otimiza as skills para ATS (Applicant Tracking Systems)
</regras>

<formato_json>
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "aboutMe": "string",
  "photoUrl": "",
  "experiences": [
    { "company": "string", "role": "string", "period": "string", "description": "string" }
  ],
  "education": [
    { "school": "string", "degree": "string", "period": "string" }
  ],
  "skills": ["string"]
}
</formato_json>
`;

  const raw = await askClaude(prompt);
  return JSON.parse(extractJSON(raw));
}

// ============================================================================
// 2. Gerar Carta de Apresentação
// ============================================================================
export async function generateCoverLetterAI(
  user: IUser,
  jobData: { title: string; company: string; description: string }
): Promise<string> {
  const prompt = `
És um especialista em cartas de apresentação para o mercado europeu.

Escreve uma carta de apresentação profissional em português de Portugal.

<dados_candidato>
Nome: ${user.fullName}
Profissão: ${user.currentProfession || ''}
Resumo profissional: ${user.professionalSummary || user.personalDescription || ''}
Experiências: ${JSON.stringify(user.experiences || [], null, 2)}
Competências: ${JSON.stringify(user.skills || [], null, 2)}
</dados_candidato>

<dados_vaga>
Cargo: ${jobData.title}
Empresa: ${jobData.company}
Descrição da vaga: ${jobData.description}
</dados_vaga>

<regras>
- Exatamente 3 parágrafos
- Parágrafo 1: apresentação + motivação pela empresa/vaga (menciona a empresa pelo nome)
- Parágrafo 2: 2-3 conquistas ou experiências relevantes para ESTA vaga específica
- Parágrafo 3: disponibilidade, entusiasmo e call-to-action
- Tom profissional mas humano — não robótico
- Não uses frases genéricas como "venho por este meio"
- Não inventes experiências que não existam nos dados
- Responde APENAS com o texto da carta, sem assunto nem assinatura
</regras>
`;

  return askClaude(prompt, 1024);
}

// ============================================================================
// 3. Otimização ATS
//    Recebe texto do CV e devolve versão melhorada
// ============================================================================
export async function optimizeATS(resumeText: string): Promise<string> {
  const prompt = `
Otimiza o currículo abaixo para sistemas ATS (Applicant Tracking Systems).

<curriculo>
${resumeText}
</curriculo>

<regras>
- Melhora as palavras-chave sem alterar os factos
- Usa verbos de ação no início das descrições (liderou, desenvolveu, implementou, aumentou)
- Garante que as secções têm títulos standard: Experiência Profissional, Formação, Competências
- Remove formatação especial que ATS não consegue ler
- Mantém o tom profissional
- Responde apenas com o currículo otimizado, sem comentários
</regras>
`;

  return askClaude(prompt);
}

// ============================================================================
// 4. Resumo Profissional
//    Gera um resumo forte para o topo do CV
// ============================================================================
export async function generateProfessionalSummary(user: IUser): Promise<string> {
  const prompt = `
Cria um resumo profissional forte para o topo de um currículo europeu.

<dados_candidato>
Nome: ${user.fullName}
Profissão: ${user.currentProfession || ''}
Anos de experiência aproximados: ${user.experiences?.length ? user.experiences.length + ' cargos anteriores' : 'não indicado'}
Competências: ${JSON.stringify(user.skills || [])}
Objetivos: ${user.goals || ''}
Descrição pessoal: ${user.personalDescription || ''}
</dados_candidato>

<regras>
- Máximo 4 linhas / 60 palavras
- Português de Portugal
- Tom confiante e profissional
- Inclui: profissão + anos de experiência (se aplicável) + 2 pontos fortes + proposta de valor
- Não começa com "Sou" — começa com a profissão ou uma qualidade
- Responde apenas com o texto do resumo, sem aspas nem formatação extra
</regras>
`;

  return askClaude(prompt, 512);
}

// ============================================================================
// 5. [NOVO] Match Score — compatibilidade candidato/vaga
//    Grátis, sem chamada adicional ao Claude quando score < 40
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
  ].map((k) => k.toLowerCase()).filter(Boolean);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of userKeywords) {
    if (desc.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const score = userKeywords.length > 0
    ? Math.min(100, Math.round((matchedKeywords.length / userKeywords.length) * 100))
    : 0;

  return { score, matchedKeywords, missingKeywords };
}
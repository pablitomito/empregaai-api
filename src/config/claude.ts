import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY não está definida nas variáveis de ambiente');
}

// ============================================================================
// Cliente Claude
// ============================================================================
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// Configurações
// ============================================================================
export const CLAUDE_CONFIG = {
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 2048,
};

// ============================================================================
// Função auxiliar central — substitui generateAIContent do openai.ts
// ============================================================================
export const generateAIContent = async (
  prompt: string,
  options: {
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> => {
  try {
    const response = await claude.messages.create({
      model: CLAUDE_CONFIG.MODEL,
      max_tokens: options.maxTokens ?? CLAUDE_CONFIG.MAX_TOKENS,
      ...(options.systemPrompt && {
        system: options.systemPrompt,
      }),
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Resposta inesperada do Claude');
    return block.text;
  } catch (error: any) {
    console.error('❌ Erro ao gerar conteúdo com Claude:', error.message);
    throw new Error('Falha ao gerar conteúdo com IA');
  }
};

// ============================================================================
// System prompt base — reutilizado em todos os prompts
// ============================================================================
const BASE_SYSTEM = `És um especialista sénior em recursos humanos e otimização de currículos 
para o mercado de trabalho português e europeu. Conheces profundamente os sistemas ATS 
(Applicant Tracking Systems) e as melhores práticas de recrutamento em Portugal.
Respondes sempre em português de Portugal, com tom profissional e direto.`;

// ============================================================================
// 1. Resumo Profissional Otimizado para Vaga Específica
//    (migrado de generateOptimizedSummaryPrompt)
// ============================================================================
export const generateOptimizedSummaryPrompt = (
  userProfile: any,
  jobDescription: string
): string => {
  return `
<perfil_candidato>
  Nome: ${userProfile.fullName}
  Objetivo: ${userProfile.objective === 'urgent_job' ? 'Conseguir emprego urgente' : 'Mudar de carreira'}
  Áreas de interesse: ${userProfile.interestedAreas?.join(', ') || 'não indicado'}
  Profissão atual: ${userProfile.currentProfession || 'não indicado'}
  Experiências: ${JSON.stringify(userProfile.experiences || [])}
  Formação: ${JSON.stringify(userProfile.education || [])}
  Competências: ${userProfile.skills?.join(', ') || 'não indicadas'}
  Idiomas: ${JSON.stringify(userProfile.languages || [])}
  Descrição pessoal: ${userProfile.personalDescription || ''}
</perfil_candidato>

<descricao_vaga>
${jobDescription}
</descricao_vaga>

<tarefa>
Cria um resumo profissional OTIMIZADO para esta vaga específica com máximo 150 palavras.

Regras obrigatórias:
- Destaca experiências e competências mais relevantes para os requisitos da vaga
- Incorpora naturalmente as palavras-chave da descrição (otimização ATS)
- Tom confiante e profissional — não usa frases como "venho por este meio"
- Português de Portugal (não brasileiro)
- Menciona resultados ou conquistas concretas sempre que possível
- Não começa com "Sou" nem "Eu"

Responde APENAS com o resumo profissional, sem introduções, títulos ou explicações.
</tarefa>
`;
};

// ============================================================================
// 2. Carta de Apresentação
//    (migrado de generateCoverLetterPrompt)
// ============================================================================
export const generateCoverLetterPrompt = (
  userProfile: any,
  job: { title: string; company: string; description: string; requirements?: string[] }
): string => {
  return `
<perfil_candidato>
${JSON.stringify(userProfile, null, 2)}
</perfil_candidato>

<vaga>
  Cargo: ${job.title}
  Empresa: ${job.company}
  Descrição: ${job.description}
  Requisitos: ${job.requirements?.join(', ') || 'não especificados'}
</vaga>

<tarefa>
Escreve uma carta de apresentação profissional e persuasiva com máximo 300 palavras.

Estrutura obrigatória:
- Parágrafo 1: apresentação + motivação genuína pela empresa "${job.company}" (menciona pelo nome)
- Parágrafo 2: 2-3 experiências ou conquistas concretas que respondem aos requisitos desta vaga
- Parágrafo 3: disponibilidade para entrevista + call-to-action confiante

Regras:
- Tom profissional mas caloroso — não robótico
- Não usa "venho por este meio candidatar-me"
- Não inventa experiências que não existam no perfil
- Português de Portugal

Formato de saída:
Exmo(a). Senhor(a) Recrutador(a),

[3 parágrafos]

Com os melhores cumprimentos,
${userProfile.fullName}

Responde APENAS com a carta, sem introduções ou comentários.
</tarefa>
`;
};

// ============================================================================
// 3. Extração de Palavras-chave ATS
//    (migrado de extractATSKeywordsPrompt)
// ============================================================================
export const extractATSKeywordsPrompt = (jobDescription: string): string => {
  return `
<descricao_vaga>
${jobDescription}
</descricao_vaga>

<tarefa>
Analisa esta descrição de vaga e extrai as palavras-chave mais importantes para otimização ATS.

Inclui obrigatoriamente:
- Competências técnicas (hard skills)
- Ferramentas, tecnologias ou softwares mencionados
- Soft skills explicitamente referidas
- Requisitos obrigatórios (formação, certificações, experiência)
- Termos específicos da indústria ou setor

Regras:
- Lista exatamente 10 a 15 palavras-chave
- Ordena por relevância (mais críticas primeiro)
- Usa os termos exatos da descrição (não sinónimos)
- Inclui termos em português E inglês se ambos aparecerem

Responde APENAS com as palavras-chave separadas por vírgula, sem numeração, sem explicações.
</tarefa>
`;
};

// ============================================================================
// 4. [NOVO] Análise de compatibilidade perfil/vaga com IA
//    Complementa o calculateMatchScore local com análise qualitativa
// ============================================================================
export const generateMatchAnalysisPrompt = (
  userProfile: any,
  jobDescription: string
): string => {
  return `
<perfil_candidato>
  Profissão: ${userProfile.currentProfession || ''}
  Competências: ${userProfile.skills?.join(', ') || ''}
  Idiomas: ${JSON.stringify(userProfile.languages || [])}
  Experiências: ${JSON.stringify(userProfile.experiences || [])}
  Áreas de interesse: ${userProfile.interestedAreas?.join(', ') || ''}
</perfil_candidato>

<descricao_vaga>
${jobDescription}
</descricao_vaga>

<tarefa>
Avalia a compatibilidade entre o candidato e a vaga.

Responde APENAS em JSON válido, sem markdown, sem texto extra:
{
  "score": número de 0 a 100,
  "level": "Excelente" | "Bom" | "Moderado" | "Fraco",
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "gaps": ["lacuna 1", "lacuna 2"],
  "recommendation": "frase de 1 linha com recomendação ao candidato"
}
</tarefa>
`;
};

// ============================================================================
// Funções prontas a usar — chamam generateAIContent internamente.
// Podem ser importadas diretamente em qualquer service ou controller.
// ============================================================================

export const getOptimizedSummary = async (
  userProfile: any,
  jobDescription: string
): Promise<string> =>
  generateAIContent(
    generateOptimizedSummaryPrompt(userProfile, jobDescription),
    { systemPrompt: BASE_SYSTEM, maxTokens: 512 }
  );

export const getCoverLetter = async (
  userProfile: any,
  job: { title: string; company: string; description: string; requirements?: string[] }
): Promise<string> =>
  generateAIContent(
    generateCoverLetterPrompt(userProfile, job),
    { systemPrompt: BASE_SYSTEM, maxTokens: 1024 }
  );

export const getATSKeywords = async (jobDescription: string): Promise<string[]> => {
  const raw = await generateAIContent(
    extractATSKeywordsPrompt(jobDescription),
    { systemPrompt: BASE_SYSTEM, maxTokens: 256 }
  );
  return raw.split(',').map((k) => k.trim()).filter(Boolean);
};

export const getMatchAnalysis = async (
  userProfile: any,
  jobDescription: string
): Promise<{
  score: number;
  level: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}> => {
  const raw = await generateAIContent(
    generateMatchAnalysisPrompt(userProfile, jobDescription),
    { systemPrompt: BASE_SYSTEM, maxTokens: 512 }
  );
  return JSON.parse(raw);
};

export default claude;
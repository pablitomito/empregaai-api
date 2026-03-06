import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não está definida nas variáveis de ambiente');
}

// ============================================================================
// Cliente Groq
// ============================================================================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ============================================================================
// Configurações
// ============================================================================
export const GROQ_CONFIG = {
  MODEL: 'llama-3.1-70b-versatile', // Melhor modelo disponível no Groq grátis
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.3, // Baixo = mais consistente e profissional
};

// ============================================================================
// Função auxiliar central
// Substitui generateAIContent do openai.ts — mesma assinatura, drop-in replacement
// ============================================================================
export const generateAIContent = async (
  prompt: string,
  options: {
    maxTokens?: number;
    systemPrompt?: string;
    temperature?: number;
  } = {}
): Promise<string> => {
  try {
    const response = await groq.chat.completions.create({
      model: GROQ_CONFIG.MODEL,
      max_tokens: options.maxTokens ?? GROQ_CONFIG.MAX_TOKENS,
      temperature: options.temperature ?? GROQ_CONFIG.TEMPERATURE,
      messages: [
        ...(options.systemPrompt
          ? [{ role: 'system' as const, content: options.systemPrompt }]
          : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  } catch (error: any) {
    console.error('❌ Erro ao gerar conteúdo com Groq:', error.message);
    throw new Error('Falha ao gerar conteúdo com IA');
  }
};

// ============================================================================
// System prompt base — reutilizado em todos os prompts
// ============================================================================
const BASE_SYSTEM = `És um especialista sénior em recursos humanos e otimização de currículos
para o mercado de trabalho português e europeu. Conheces profundamente os sistemas ATS
(Applicant Tracking Systems) e as melhores práticas de recrutamento em Portugal.
Respondes sempre em português de Portugal, com tom profissional e direto.
Nunca inventas informações que não existam nos dados fornecidos.`;

// ============================================================================
// 1. Resumo Profissional Otimizado para Vaga Específica
// ============================================================================
export const generateOptimizedSummaryPrompt = (
  userProfile: any,
  jobDescription: string
): string => `
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
- Tom confiante e profissional
- Português de Portugal (não brasileiro)
- Menciona resultados ou conquistas concretas sempre que possível
- Não começa com "Sou" nem "Eu"
- Não uses frases como "venho por este meio"

Responde APENAS com o resumo profissional, sem introduções, títulos ou explicações.
</tarefa>
`;

// ============================================================================
// 2. Carta de Apresentação
// ============================================================================
export const generateCoverLetterPrompt = (
  userProfile: any,
  job: { title: string; company: string; description: string; requirements?: string[] }
): string => `
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
- Tom profissional mas caloroso, não robótico
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

// ============================================================================
// 3. Extração de Palavras-chave ATS
// ============================================================================
export const extractATSKeywordsPrompt = (jobDescription: string): string => `
<descricao_vaga>
${jobDescription}
</descricao_vaga>

<tarefa>
Analisa esta descrição de vaga e extrai as palavras-chave mais importantes para otimização ATS.

Inclui obrigatoriamente:
- Competências técnicas (hard skills)
- Ferramentas, tecnologias ou softwares mencionados
- Soft skills explicitamente referidas
- Requisitos obrigatórios (formação, certificações, anos de experiência)
- Termos específicos da indústria ou setor

Regras:
- Lista exatamente 10 a 15 palavras-chave
- Ordena por relevância (mais críticas primeiro)
- Usa os termos exatos da descrição (não sinónimos)

Responde APENAS com as palavras-chave separadas por vírgula, sem numeração, sem explicações.
</tarefa>
`;

// ============================================================================
// 4. Gerar CV completo em JSON estruturado
// ============================================================================
export const generateResumeJSONPrompt = (user: any): string => `
<dados_candidato>
  Nome: ${user.fullName}
  Email: ${user.email}
  Telefone: ${user.phone || ''}
  Localização: ${user.location || ''}
  Profissão: ${user.currentProfession || ''}
  Resumo atual: ${user.professionalSummary || user.personalDescription || ''}
  Objetivos: ${user.goals || ''}
  Experiências: ${JSON.stringify(user.experiences || [], null, 2)}
  Formação: ${JSON.stringify(user.education || [], null, 2)}
  Competências: ${JSON.stringify(user.skills || [])}
  Idiomas: ${JSON.stringify(user.languages || [])}
</dados_candidato>

<tarefa>
Gera um currículo profissional otimizado com base nos dados acima.
Responde APENAS com JSON válido, sem markdown, sem texto extra.

Regras:
- O campo "aboutMe" deve ser um resumo profissional forte de 3-4 linhas
- Reescreve as descrições de experiência com foco em resultados e impacto
- Normaliza os períodos no formato "Jan 2022 – Mar 2024" ou "Jan 2022 – Presente"
- Não inventes informações que não estejam nos dados
- Português de Portugal

JSON de saída (estrutura exata):
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
</tarefa>
`;

// ============================================================================
// 5. Resumo profissional standalone (para guardar no perfil)
// ============================================================================
export const generateProfessionalSummaryPrompt = (user: any): string => `
<dados_candidato>
  Nome: ${user.fullName}
  Profissão: ${user.currentProfession || ''}
  Competências: ${user.skills?.join(', ') || ''}
  Experiências (número de cargos): ${user.experiences?.length || 0}
  Objetivos: ${user.goals || ''}
  Descrição pessoal: ${user.personalDescription || ''}
</dados_candidato>

<tarefa>
Cria um resumo profissional forte para o topo do currículo.

Regras:
- Máximo 4 linhas / 60 palavras
- Português de Portugal
- Tom confiante e profissional
- Inclui: profissão + pontos fortes + proposta de valor
- Não começa com "Sou"
- Responde apenas com o texto do resumo, sem aspas nem formatação extra
</tarefa>
`;

// ============================================================================
// 6. [NOVO] Análise de compatibilidade perfil/vaga
// ============================================================================
export const generateMatchAnalysisPrompt = (
  userProfile: any,
  jobDescription: string
): string => `
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
Responde APENAS com JSON válido, sem markdown, sem texto extra:
{
  "score": número de 0 a 100,
  "level": "Excelente" | "Bom" | "Moderado" | "Fraco",
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "gaps": ["lacuna 1", "lacuna 2"],
  "recommendation": "frase de 1 linha com recomendação ao candidato"
}
</tarefa>
`;

// ============================================================================
// Funções prontas — chamam generateAIContent internamente
// ============================================================================

export const getOptimizedSummary = (userProfile: any, jobDescription: string) =>
  generateAIContent(generateOptimizedSummaryPrompt(userProfile, jobDescription), {
    systemPrompt: BASE_SYSTEM, maxTokens: 512,
  });

export const getCoverLetter = (
  userProfile: any,
  job: { title: string; company: string; description: string; requirements?: string[] }
) =>
  generateAIContent(generateCoverLetterPrompt(userProfile, job), {
    systemPrompt: BASE_SYSTEM, maxTokens: 1024,
  });

export const getATSKeywords = async (jobDescription: string): Promise<string[]> => {
  const raw = await generateAIContent(extractATSKeywordsPrompt(jobDescription), {
    systemPrompt: BASE_SYSTEM, maxTokens: 256,
  });
  return raw.split(',').map((k) => k.trim()).filter(Boolean);
};

export const getMatchAnalysis = async (
  userProfile: any,
  jobDescription: string
): Promise<{ score: number; level: string; strengths: string[]; gaps: string[]; recommendation: string }> => {
  const raw = await generateAIContent(generateMatchAnalysisPrompt(userProfile, jobDescription), {
    systemPrompt: BASE_SYSTEM, maxTokens: 512,
  });
  // Remove possíveis blocos ```json ``` que o Llama por vezes adiciona
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

export default groq;
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY não está definida nas variáveis de ambiente');
}

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurações
export const OPENAI_CONFIG = {
  MODEL: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
};

// Prompt base para otimização de resumo profissional
export const generateOptimizedSummaryPrompt = (
  userProfile: any,
  jobDescription: string
) => {
  return `Você é um especialista em currículos e RH em Portugal. 

PERFIL DO CANDIDATO:
- Nome: ${userProfile.fullName}
- Objetivo: ${userProfile.objective === 'urgent_job' ? 'Conseguir emprego urgente' : 'Mudar de carreira'}
- Áreas de interesse: ${userProfile.interestedAreas?.join(', ')}
- Experiências: ${JSON.stringify(userProfile.experiences)}
- Formação: ${JSON.stringify(userProfile.education)}
- Habilidades: ${userProfile.skills?.join(', ')}
- Idiomas: ${JSON.stringify(userProfile.languages)}
- Descrição pessoal: ${userProfile.personalDescription}

VAGA:
${jobDescription}

TAREFA:
Crie um resumo profissional OTIMIZADO para esta vaga específica (máximo 150 palavras). O resumo deve:
1. Destacar as experiências e habilidades mais relevantes para a vaga
2. Usar palavras-chave da descrição da vaga (otimização ATS)
3. Ser convincente e profissional
4. Estar em português de Portugal
5. Mostrar valor e resultados alcançados

Responda APENAS com o resumo profissional, sem introduções ou explicações.`;
};

// Prompt para gerar carta de apresentação
export const generateCoverLetterPrompt = (
  userProfile: any,
  job: any
) => {
  return `Você é um especialista em cartas de apresentação para o mercado português.

CANDIDATO:
${JSON.stringify(userProfile, null, 2)}

VAGA:
- Cargo: ${job.title}
- Empresa: ${job.company}
- Descrição: ${job.description}
- Requisitos: ${job.requirements?.join(', ')}

TAREFA:
Escreva uma carta de apresentação profissional e persuasiva (máximo 300 palavras) que:
1. Demonstre entusiasmo genuíno pela vaga e empresa
2. Conecte as experiências do candidato aos requisitos da vaga
3. Destaque conquistas e resultados específicos
4. Mostre conhecimento sobre a empresa
5. Termine com um call-to-action claro
6. Use tom profissional mas caloroso
7. Esteja em português de Portugal

Formato:
[Saudação apropriada],

[3-4 parágrafos]

[Despedida profissional]
[Nome do candidato]

Responda APENAS com a carta, sem introduções.`;
};

// Prompt para extrair palavras-chave ATS
export const extractATSKeywordsPrompt = (jobDescription: string) => {
  return `Analise esta descrição de vaga e extraia as palavras-chave mais importantes para otimização de ATS (Applicant Tracking System).

DESCRIÇÃO DA VAGA:
${jobDescription}

TAREFA:
Liste 10-15 palavras-chave críticas que devem aparecer no currículo para passar pelos filtros ATS. Inclua:
- Habilidades técnicas
- Ferramentas e tecnologias
- Soft skills mencionadas
- Requisitos obrigatórios
- Termos específicos da indústria

Responda APENAS com as palavras-chave separadas por vírgula, sem numeração ou explicações.`;
};

// Função auxiliar: Gerar conteúdo com OpenAI
export const generateAIContent = async (
  prompt: string,
  maxTokens: number = OPENAI_CONFIG.MAX_TOKENS
): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em recursos humanos e otimização de currículos para o mercado português.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: OPENAI_CONFIG.TEMPERATURE,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Erro ao gerar conteúdo com OpenAI:', error.message);
    throw new Error('Falha ao gerar conteúdo com IA');
  }
};

export default openai;

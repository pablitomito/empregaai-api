import OpenAI from 'openai';
declare const openai: OpenAI;
export declare const OPENAI_CONFIG: {
    MODEL: string;
    MAX_TOKENS: number;
    TEMPERATURE: number;
};
export declare const generateOptimizedSummaryPrompt: (userProfile: any, jobDescription: string) => string;
export declare const generateCoverLetterPrompt: (userProfile: any, job: any) => string;
export declare const extractATSKeywordsPrompt: (jobDescription: string) => string;
export declare const generateAIContent: (prompt: string, maxTokens?: number) => Promise<string>;
export default openai;
//# sourceMappingURL=openai.d.ts.map
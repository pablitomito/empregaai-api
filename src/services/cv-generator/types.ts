export interface UserCVData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages?: Language[];
  industry?: string;
  experienceYears?: number;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface TemplateConfig {
  name: string;
  category: 'executivo' | 'tech' | 'minimalista' | 'criativo' | 'ats';
  weight: number;
  suitableFor: string[];
}
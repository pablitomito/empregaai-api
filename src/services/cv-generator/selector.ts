import { UserCVData, TemplateConfig } from './types';

const templates: TemplateConfig[] = [
  {
    name: 'executivo',
    category: 'executivo',
    weight: 30,
    suitableFor: ['gestor', 'director', 'executivo', 'manager', 'coordenador']
  },
  {
    name: 'tech-modern',
    category: 'tech',
    weight: 35,
    suitableFor: ['developer', 'programador', 'engenheiro', 'tech', 'it', 'software']
  },
  {
    name: 'minimalista',
    category: 'minimalista',
    weight: 35,
    suitableFor: ['admin', 'comercial', 'vendas', 'marketing', 'assistente']
  }, 
  {
    name: 'criativo',
    category: 'minimalista', // ou criar nova categoria
    weight: 20,
    suitableFor: ['designer', 'criativo', 'marketing', 'publicidade', 'ux']
  },
  {
    name: 'ats-optimized',
    category: 'minimalista',
    weight: 15,
    suitableFor: ['junior', 'entry', 'estagio', 'trainee']
  }
];

export function selectTemplate(userData: UserCVData): string {
  const roleLower = userData.role.toLowerCase();
  const industryLower = (userData.industry || '').toLowerCase();
  
  for (const template of templates) {
    const matchesRole = template.suitableFor.some(keyword => 
      roleLower.includes(keyword) || industryLower.includes(keyword)
    );
    
    if (matchesRole) {
      console.log(`✅ Template: ${template.name} (match)`);
      return template.name;
    }
  }
  
  const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const template of templates) {
    if (random < template.weight) {
      console.log(`✅ Template: ${template.name} (random)`);
      return template.name;
    }
    random -= template.weight;
  }
  
  return 'minimalista';
}
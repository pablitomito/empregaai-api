import { generateCVPDF } from './src/services/cv-generator/generator';
import fs from 'fs';

const testData = {
  name: 'João Silva Santos',
  email: 'joao.silva@example.com',
  phone: '+351 912 345 678',
  location: 'Lisboa, Portugal',
  role: 'Desenvolvedor Full-Stack Sênior',
  summary: 'Desenvolvedor Full-Stack com mais de 8 anos de experiência em desenvolvimento de aplicações web escaláveis. Especialista em React, Node.js e arquitetura de sistemas. Apaixonado por criar soluções tecnológicas que impactam positivamente o negócio.',
  experiences: [
    {
      title: 'Senior Full-Stack Developer',
      company: 'Tech Solutions Portugal',
      location: 'Lisboa',
      startDate: 'Janeiro 2020',
      endDate: 'Presente',
      current: true,
      description: 'Liderança técnica em projetos de larga escala, desenvolvimento de APIs RESTful, implementação de arquitetura de microserviços. Responsável por otimizações que resultaram em redução de 40% no tempo de resposta.'
    },
    {
      title: 'Full-Stack Developer',
      company: 'StartupXYZ',
      location: 'Porto',
      startDate: 'Março 2018',
      endDate: 'Dezembro 2019',
      current: false,
      description: 'Desenvolvimento de plataforma SaaS em React e Node.js. Implementação de sistema de pagamentos com Stripe. Criação de dashboard analytics em tempo real.'
    },
    {
      title: 'Junior Developer',
      company: 'WebAgency',
      location: 'Lisboa',
      startDate: 'Junho 2016',
      endDate: 'Fevereiro 2018',
      current: false,
      description: 'Desenvolvimento de websites corporativos e e-commerce. Manutenção de aplicações WordPress e Laravel.'
    }
  ],
  education: [
    {
      degree: 'Mestrado em Engenharia Informática',
      institution: 'Instituto Superior Técnico',
      location: 'Lisboa',
      year: '2016'
    },
    {
      degree: 'Licenciatura em Ciências da Computação',
      institution: 'Universidade de Coimbra',
      location: 'Coimbra',
      year: '2014'
    }
  ],
  skills: [
    'React', 'Node.js', 'TypeScript', 'Next.js',
    'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
    'Git', 'CI/CD', 'REST APIs', 'GraphQL'
  ],
  languages: [
    { name: 'Português', level: 'Nativo' },
    { name: 'Inglês', level: 'Fluente' },
    { name: 'Espanhol', level: 'Intermédio' }
  ],
  industry: 'tech',
  experienceYears: 8
};

async function test() {
  console.log('🧪 Iniciando teste de geração de CV...\n');
  
  try {
    // Gera o PDF
    const pdf = await generateCVPDF(testData);
    
    // Salva o arquivo
    const filename = `test-cv-${Date.now()}.pdf`;
    fs.writeFileSync(filename, pdf);
    
    console.log('✅ PDF gerado com sucesso!');
    console.log(`📄 Arquivo salvo: ${filename}`);
    console.log(`📊 Tamanho: ${(pdf.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar CV:', error);
  }
}

test();
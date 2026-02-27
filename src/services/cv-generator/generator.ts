import { chromium } from 'playwright';
import { UserCVData } from './types';
import { selectTemplate } from './selector';
import { generateExecutivoTemplate } from './templates/executivo';
import { generateTechModernTemplate } from './templates/tech-modern';
import { generateMinimalistaTemplate } from './templates/minimalista';
import { generateCreativoTemplate } from './templates/criativo';          
import { generateATSOptimizedTemplate } from './templates/ats-optimized'; 

export async function generateCVPDF(userData: UserCVData): Promise<Buffer> {
  console.log('🎨 Gerando CV para:', userData.name);

  const templateName = selectTemplate(userData);

  let html: string;

  switch (templateName) {
    case 'executivo':
      html = generateExecutivoTemplate(userData);
      break;
    case 'tech-modern':
      html = generateTechModernTemplate(userData);
      break;
    case 'minimalista':
      html = generateMinimalistaTemplate(userData);
      break;
        case 'criativo':                                   
      html = generateCreativoTemplate(userData);       
      break;                                             
    case 'ats-optimized':                               
      html = generateATSOptimizedTemplate(userData);    
      break;                                             
    default:
      html = generateMinimalistaTemplate(userData);
      
  }

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });

  await browser.close();

  console.log('✅ PDF gerado com sucesso!');

  return Buffer.from(pdf);
}
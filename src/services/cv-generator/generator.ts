import puppeteer from 'puppeteer';
import { UserCVData } from './types';
import { selectTemplate } from './selector';
import { generateExecutivoTemplate } from './templates/executivo';
import { generateTechModernTemplate } from './templates/tech-modern';
import { generateMinimalistaTemplate } from './templates/minimalista';

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
    default:
      html = generateMinimalistaTemplate(userData);
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  
  console.log('✅ PDF gerado!');
  return pdf;
}
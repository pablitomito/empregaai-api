import { UserCVData } from '../types';

export function generateExecutivoTemplate(data: UserCVData): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    
    body {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1f2937;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
    }
    
    .header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .name {
      font-size: 32pt;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    
    .role {
      font-size: 14pt;
      color: #2563eb;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .contact {
      display: flex;
      gap: 15px;
      font-size: 9pt;
      color: #6b7280;
      flex-wrap: wrap;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .summary {
      color: #4b5563;
      line-height: 1.6;
      text-align: justify;
    }
    
    .experience-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .job-title {
      font-size: 11pt;
      font-weight: 700;
      color: #111827;
    }
    
    .company {
      font-size: 10pt;
      font-weight: 600;
      color: #2563eb;
    }
    
    .job-meta {
      font-size: 9pt;
      color: #6b7280;
      margin: 5px 0 8px 0;
    }
    
    .job-description {
      color: #4b5563;
      text-align: justify;
    }
    
    .education-item {
      margin-bottom: 15px;
    }
    
    .degree {
      font-weight: 600;
      color: #111827;
    }
    
    .institution {
      font-size: 9pt;
      color: #6b7280;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    
    .skill-tag {
      padding: 6px 12px;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="name">${data.name}</h1>
      <div class="role">${data.role}</div>
      <div class="contact">
        <span>📧 ${data.email}</span>
        <span>📱 ${data.phone}</span>
        <span>📍 ${data.location}</span>
      </div>
    </div>
    
    ${data.summary ? `
    <div class="section">
      <h2 class="section-title">Resumo Profissional</h2>
      <p class="summary">${data.summary}</p>
    </div>
    ` : ''}
    
    <div class="section">
      <h2 class="section-title">Experiência Profissional</h2>
      ${data.experiences.map(exp => `
        <div class="experience-item">
          <div class="job-title">${exp.title}</div>
          <div class="company">${exp.company}</div>
          <div class="job-meta">
            ${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate} • ${exp.location}
          </div>
          <div class="job-description">${exp.description}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Formação Académica</h2>
      ${data.education.map(edu => `
        <div class="education-item">
          <div class="degree">${edu.degree}</div>
          <div class="institution">${edu.institution} • ${edu.year}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Competências</h2>
      <div class="skills-grid">
        ${data.skills.map(skill => `
          <div class="skill-tag">${skill}</div>
        `).join('')}
      </div>
    </div>
    
    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Idiomas</h2>
      ${data.languages.map(lang => `
        <span style="margin-right: 15px; font-size: 9pt;">
          <strong>${lang.name}</strong> (${lang.level})
        </span>
      `).join('')}
    </div>
    ` : ''}
  </div>
</body>
</html>
  `;
}
import { UserCVData } from '../types';

export function generateMinimalistaTemplate(data: UserCVData): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    
    body {
      font-family: 'Inter', sans-serif;
      font-size: 9.5pt;
      line-height: 1.6;
      color: #374151;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 20mm;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .name {
      font-size: 28pt;
      font-weight: 600;
      color: #111827;
      margin-bottom: 5px;
    }
    
    .role {
      font-size: 11pt;
      color: #6b7280;
      margin-bottom: 12px;
    }
    
    .contact {
      font-size: 8pt;
      color: #9ca3af;
    }
    
    .section {
      margin-bottom: 22px;
    }
    
    .section-title {
      font-size: 10pt;
      font-weight: 600;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    
    .experience-item {
      margin-bottom: 16px;
    }
    
    .job-title {
      font-weight: 600;
      color: #111827;
    }
    
    .company {
      color: #6b7280;
      font-size: 9pt;
    }
    
    .job-meta {
      font-size: 8pt;
      color: #9ca3af;
      margin: 3px 0 6px 0;
    }
    
    .job-description {
      color: #4b5563;
      font-size: 9pt;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="name">${data.name}</h1>
      <div class="role">${data.role}</div>
      <div class="contact">
        ${data.email} • ${data.phone} • ${data.location}
      </div>
    </div>
    
    ${data.summary ? `
    <div class="section">
      <h2 class="section-title">Perfil</h2>
      <p>${data.summary}</p>
    </div>
    ` : ''}
    
    <div class="section">
      <h2 class="section-title">Experiência</h2>
      ${data.experiences.map(exp => `
        <div class="experience-item">
          <div class="job-title">${exp.title}</div>
          <div class="company">${exp.company}</div>
          <div class="job-meta">${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate}</div>
          <div class="job-description">${exp.description}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Formação</h2>
      ${data.education.map(edu => `
        <div style="margin-bottom: 10px;">
          <div style="font-weight: 600; font-size: 9pt;">${edu.degree}</div>
          <div style="font-size: 8pt; color: #6b7280;">${edu.institution}, ${edu.year}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Competências</h2>
      <div style="color: #4b5563; font-size: 9pt;">
        ${data.skills.join(' • ')}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
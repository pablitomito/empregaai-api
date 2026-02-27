import { UserCVData } from '../types';

export function generateTechModernTemplate(data: UserCVData): string {
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
      color: #1f2937;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      background: white;
    }
    
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
      padding: 30px 40px;
      color: white;
    }
    
    .name {
      font-size: 36pt;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .role {
      font-size: 14pt;
      opacity: 0.95;
      margin-bottom: 15px;
    }
    
    .contact {
      display: flex;
      gap: 20px;
      font-size: 9pt;
      opacity: 0.9;
    }
    
    .content {
      padding: 30px 40px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #2563eb;
    }
    
    .experience-item {
      margin-bottom: 18px;
      padding-left: 15px;
      border-left: 3px solid #dbeafe;
    }
    
    .job-title {
      font-weight: 700;
      color: #111827;
    }
    
    .company {
      font-weight: 600;
      color: #2563eb;
    }
    
    .job-meta {
      font-size: 8pt;
      color: #6b7280;
      margin: 5px 0;
    }
    
    .job-description {
      color: #4b5563;
      font-size: 9pt;
    }
    
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-badge {
      padding: 5px 12px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 6px;
      font-size: 8pt;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="name">${data.name}</h1>
      <div class="role">${data.role}</div>
      <div class="contact">
        <span>${data.email}</span>
        <span>${data.phone}</span>
        <span>${data.location}</span>
      </div>
    </div>
    
    <div class="content">
      ${data.summary ? `
      <div class="section">
        <h2 class="section-title">Sobre</h2>
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
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600;">${edu.degree}</div>
            <div style="font-size: 9pt; color: #6b7280;">${edu.institution} (${edu.year})</div>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
          ${data.skills.map(skill => `
            <span class="skill-badge">${skill}</span>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
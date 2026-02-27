import { UserCVData } from '../types';

export function generateCreativoTemplate(data: UserCVData): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    
    body {
      font-family: 'Poppins', sans-serif;
      font-size: 10pt;
      color: #2d3748;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      display: flex;
    }
    
    .sidebar {
      width: 35%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      padding: 30px 25px;
      color: white;
    }
    
    .main-content {
      width: 65%;
      padding: 30px 35px;
      background: white;
    }
    
    .profile-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: white;
      margin: 0 auto 20px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48pt;
      font-weight: 700;
      color: #667eea;
    }
    
    .name {
      font-size: 24pt;
      font-weight: 700;
      text-align: center;
      margin-bottom: 5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .role {
      font-size: 11pt;
      text-align: center;
      opacity: 0.9;
      margin-bottom: 25px;
    }
    
    .sidebar-section {
      margin-bottom: 25px;
    }
    
    .sidebar-title {
      font-size: 11pt;
      font-weight: 700;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
      padding-bottom: 5px;
    }
    
    .contact-item {
      font-size: 8pt;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .skill-item {
      background: rgba(255,255,255,0.2);
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 8pt;
      display: inline-block;
      margin: 4px 4px 4px 0;
    }
    
    .main-title {
      font-size: 28pt;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 5px;
    }
    
    .main-role {
      font-size: 12pt;
      color: #718096;
      margin-bottom: 20px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
    
    .experience-item {
      margin-bottom: 18px;
      padding-left: 15px;
      border-left: 2px solid #e2e8f0;
    }
    
    .job-title {
      font-size: 11pt;
      font-weight: 700;
      color: #2d3748;
    }
    
    .company {
      font-size: 10pt;
      color: #667eea;
      font-weight: 600;
    }
    
    .job-meta {
      font-size: 8pt;
      color: #a0aec0;
      margin: 3px 0 8px 0;
    }
    
    .job-description {
      font-size: 9pt;
      color: #4a5568;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="profile-photo">
        ${data.name.split(' ').map(n => n[0]).join('')}
      </div>
      
      <h1 class="name">${data.name}</h1>
      <div class="role">${data.role}</div>
      
      <div class="sidebar-section">
        <div class="sidebar-title">Contato</div>
        <div class="contact-item">📧 ${data.email}</div>
        <div class="contact-item">📱 ${data.phone}</div>
        <div class="contact-item">📍 ${data.location}</div>
      </div>
      
      <div class="sidebar-section">
        <div class="sidebar-title">Skills</div>
        <div>
          ${data.skills.map(skill => `
            <span class="skill-item">${skill}</span>
          `).join('')}
        </div>
      </div>
      
      ${data.languages && data.languages.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">Idiomas</div>
        ${data.languages.map(lang => `
          <div style="margin-bottom: 8px; font-size: 9pt;">
            <strong>${lang.name}</strong><br/>
            <span style="opacity: 0.8; font-size: 8pt;">${lang.level}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      ${data.summary ? `
      <div class="section">
        <div class="section-title">Sobre Mim</div>
        <p style="color: #4a5568; line-height: 1.6; text-align: justify;">
          ${data.summary}
        </p>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Experiência</div>
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
        <div class="section-title">Formação</div>
        ${data.education.map(edu => `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; color: #2d3748;">${edu.degree}</div>
            <div style="font-size: 9pt; color: #718096;">
              ${edu.institution} • ${edu.year}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
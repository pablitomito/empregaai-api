import { UserCVData } from '../types';

export function generateATSOptimizedTemplate(data: UserCVData): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 15mm; }
    
    body {
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000000;
      background: white;
    }
    
    .container {
      max-width: 180mm;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 24pt;
      font-weight: 700;
      color: #000000;
      margin-bottom: 3px;
    }
    
    .subtitle {
      font-size: 12pt;
      color: #333333;
      margin-bottom: 8px;
    }
    
    .contact-info {
      font-size: 10pt;
      color: #000000;
      margin-bottom: 15px;
      line-height: 1.3;
    }
    
    .section {
      margin-bottom: 18px;
    }
    
    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #000000;
      text-transform: uppercase;
      margin-bottom: 10px;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
    }
    
    .entry {
      margin-bottom: 12px;
    }
    
    .entry-title {
      font-weight: 700;
      font-size: 11pt;
      color: #000000;
    }
    
    .entry-subtitle {
      font-weight: 500;
      font-size: 10pt;
      color: #000000;
    }
    
    .entry-meta {
      font-size: 9pt;
      color: #333333;
      margin: 2px 0 5px 0;
    }
    
    .entry-description {
      font-size: 10pt;
      color: #000000;
      line-height: 1.3;
    }
    
    .skills-list {
      font-size: 10pt;
      color: #000000;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${data.name}</h1>
      <div class="subtitle">${data.role}</div>
      <div class="contact-info">
        ${data.email} | ${data.phone} | ${data.location}
      </div>
    </header>
    
    ${data.summary ? `
    <div class="section">
      <h2>Professional Summary</h2>
      <p>${data.summary}</p>
    </div>
    ` : ''}
    
    <div class="section">
      <h2>Professional Experience</h2>
      ${data.experiences.map(exp => `
        <div class="entry">
          <div class="entry-title">${exp.title}</div>
          <div class="entry-subtitle">${exp.company}</div>
          <div class="entry-meta">
            ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}
          </div>
          <div class="entry-description">${exp.description}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>Education</h2>
      ${data.education.map(edu => `
        <div class="entry">
          <div class="entry-title">${edu.degree}</div>
          <div class="entry-subtitle">${edu.institution}</div>
          <div class="entry-meta">${edu.year}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>Skills</h2>
      <div class="skills-list">
        ${data.skills.join(' • ')}
      </div>
    </div>
    
    ${data.languages && data.languages.length > 0 ? `
    <div class="section">
      <h2>Languages</h2>
      ${data.languages.map(lang => `${lang.name} (${lang.level})`).join(' • ')}
    </div>
    ` : ''}
  </div>
</body>
</html>
  `;
}
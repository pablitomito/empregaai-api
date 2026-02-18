import PDFDocument from "pdfkit";

export function generateResumePDF(resume) {
  const doc = new PDFDocument({ margin: 50 });

  // HEADER
  doc
    .fontSize(22)
    .fillColor("#1e293b")
    .text(resume.fullName, { align: "left" })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .fillColor("#475569")
    .text(`${resume.email} | ${resume.phone} | ${resume.address}`)
    .moveDown(1);

  // RESUMO
  if (resume.aboutMe) {
    doc
      .fontSize(16)
      .fillColor("#1e293b")
      .text("Resumo Profissional", { underline: true })
      .moveDown(0.3);

    doc
      .fontSize(12)
      .fillColor("#334155")
      .text(resume.aboutMe)
      .moveDown(1);
  }

  // EXPERIÊNCIAS
  if (resume.experiences?.length) {
    doc
      .fontSize(16)
      .fillColor("#1e293b")
      .text("Experiência Profissional", { underline: true })
      .moveDown(0.5);

    resume.experiences.forEach((exp) => {
      doc
        .fontSize(14)
        .fillColor("#0f172a")
        .text(`${exp.role} — ${exp.company}`);

      doc
        .fontSize(10)
        .fillColor("#475569")
        .text(exp.period)
        .moveDown(0.3);

      doc
        .fontSize(12)
        .fillColor("#334155")
        .text(exp.description)
        .moveDown(1);
    });
  }

  // EDUCAÇÃO
  if (resume.education?.length) {
    doc
      .fontSize(16)
      .fillColor("#1e293b")
      .text("Formação Académica", { underline: true })
      .moveDown(0.5);

    resume.education.forEach((edu) => {
      doc
        .fontSize(14)
        .fillColor("#0f172a")
        .text(`${edu.degree} — ${edu.school}`);

      doc
        .fontSize(10)
        .fillColor("#475569")
        .text(edu.period)
        .moveDown(1);
    });
  }

  // SKILLS
  if (resume.skills?.length) {
    doc
      .fontSize(16)
      .fillColor("#1e293b")
      .text("Competências", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("#334155")
      .text(resume.skills.join(", "))
      .moveDown(1);
  }

  doc.end();
  return doc;
}

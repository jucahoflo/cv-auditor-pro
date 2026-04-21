import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (analysis, fileName, jobDescription, user) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Colores
  const primary = [102, 126, 234];
  const secondary = [245, 87, 108];
  const dark = [30, 30, 46];

  // ========== HEADER ==========
  doc.setFontSize(32);
  doc.setTextColor(secondary[0], secondary[1], secondary[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('KILLERJOBS', 105, 25, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Auditoría de CV con Inteligencia Artificial', 105, 35, { align: 'center' });

  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(0.5);
  doc.line(30, 42, 180, 42);

  // ========== METADATOS ==========
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.text(`📅 Fecha: ${currentDate}`, 20, 55);
  doc.text(`⏰ Hora: ${currentTime}`, 20, 62);
  doc.text(`👤 Candidato: ${user?.name || 'N/A'}`, 20, 69);
  doc.text(`📄 CV: ${fileName || 'N/A'}`, 20, 76);

  // ========== SCORE ==========
  const score = analysis.score || 0;
  doc.setFontSize(24);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`PUNTUACIÓN: ${score}%`, 140, 70, { align: 'center' });

  // Barra de progreso
  const barWidth = (score / 100) * 40;
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(140, 75, barWidth, 4, 'F');
  doc.setFillColor(220, 220, 220);
  doc.rect(140 + barWidth, 75, 40 - barWidth, 4, 'F');

  // ========== FORTALEZAS ==========
  let y = 95;
  doc.setFontSize(12);
  doc.setTextColor(72, 187, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('✅ FORTALEZAS', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont('helvetica', 'normal');
  if (analysis.strengths?.length) {
    analysis.strengths.forEach((s) => {
      doc.text(`• ${s}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No se detectaron fortalezas específicas', 25, y);
    y += 6;
  }

  // ========== ÁREAS DE MEJORA ==========
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(245, 101, 101);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠️ ÁREAS DE MEJORA', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont('helvetica', 'normal');
  if (analysis.weaknesses?.length) {
    analysis.weaknesses.forEach((w) => {
      doc.text(`• ${w}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No se detectaron áreas críticas', 25, y);
    y += 6;
  }

  // ========== HABILIDADES FALTANTES ==========
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(237, 137, 54);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 HABILIDADES FALTANTES', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont('helvetica', 'normal');
  if (analysis.missingSkills?.length) {
    analysis.missingSkills.forEach((m) => {
      doc.text(`• ${m}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No se detectaron habilidades faltantes', 25, y);
    y += 6;
  }

  // ========== RECOMENDACIONES ==========
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(66, 153, 225);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 RECOMENDACIONES', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont('helvetica', 'normal');
  if (analysis.recommendations?.length) {
    analysis.recommendations.forEach((r) => {
      doc.text(`• ${r}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No hay recomendaciones adicionales', 25, y);
    y += 6;
  }

  // ========== RESUMEN ==========
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 RESUMEN EJECUTIVO', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont('helvetica', 'normal');
  const summary = analysis.summary || 'Análisis completado exitosamente.';
  const splitSummary = doc.splitTextToSize(summary, 170);
  doc.text(splitSummary, 20, y);

  // ========== FOOTER ==========
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('KillerJobs - Auditoría de CV con IA', 105, 285, { align: 'center' });
    doc.text(`Página ${i} de ${pageCount}`, 180, 285, { align: 'center' });
  }

  // ========== FIRMA DISEÑADOR ==========
  doc.setFontSize(8);
  doc.setTextColor(secondary[0], secondary[1], secondary[2]);
  doc.text('🎨 Diseñado por Juan Carlos Holguín | Getsumi Design Architect', 105, 275, { align: 'center' });

  // Guardar PDF
  doc.save(`KillerJobs_Auditoria_${user?.name || 'Candidato'}_${Date.now()}.pdf`);
};
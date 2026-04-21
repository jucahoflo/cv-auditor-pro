import jsPDF from 'jspdf';

export const generatePDF = (analysis, fileName, user) => {
  // Crear documento
  const doc = new jsPDF();
  
  // ========== HEADER ==========
  doc.setFontSize(24);
  doc.setTextColor(102, 126, 234);
  doc.setFont('helvetica', 'bold');
  doc.text('KILLERJOBS', 105, 25, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Auditoría de CV con Inteligencia Artificial', 105, 35, { align: 'center' });
  
  // Línea decorativa
  doc.setDrawColor(102, 126, 234);
  doc.line(30, 42, 180, 42);
  
  // ========== METADATOS ==========
  const date = new Date().toLocaleDateString();
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.text(`📅 Fecha: ${date}`, 20, 55);
  doc.text(`👤 Candidato: ${user?.name || 'N/A'}`, 20, 62);
  doc.text(`📄 CV: ${fileName || 'N/A'}`, 20, 69);
  
  // ========== SCORE ==========
  const score = analysis.score || 0;
  doc.setFontSize(18);
  doc.setTextColor(102, 126, 234);
  doc.setFont('helvetica', 'bold');
  doc.text(`Puntuación: ${score}%`, 140, 65, { align: 'center' });
  
  // ========== FORTALEZAS ==========
  let y = 90;
  doc.setFontSize(11);
  doc.setTextColor(72, 187, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('✅ FORTALEZAS', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  if (analysis.strengths?.length) {
    analysis.strengths.forEach((s) => {
      doc.text(`• ${s}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No se detectaron fortalezas', 25, y);
    y += 6;
  }
  
  // ========== ÁREAS DE MEJORA ==========
  y += 5;
  doc.setFontSize(11);
  doc.setTextColor(245, 101, 101);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠️ ÁREAS DE MEJORA', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  if (analysis.weaknesses?.length) {
    analysis.weaknesses.forEach((w) => {
      doc.text(`• ${w}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('• No se detectaron áreas de mejora', 25, y);
    y += 6;
  }
  
  // ========== HABILIDADES FALTANTES ==========
  y += 5;
  doc.setFontSize(11);
  doc.setTextColor(237, 137, 54);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 HABILIDADES FALTANTES', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
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
  doc.setFontSize(11);
  doc.setTextColor(66, 153, 225);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 RECOMENDACIONES', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
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
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(102, 126, 234);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 RESUMEN EJECUTIVO', 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  const summary = analysis.summary || 'Análisis completado exitosamente.';
  const splitSummary = doc.splitTextToSize(summary, 170);
  doc.text(splitSummary, 20, y);
  
  // ========== FOOTER ==========
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('KillerJobs - Auditoría de CV con IA', 105, 280, { align: 'center' });
  doc.setTextColor(245, 87, 108);
  doc.text('🎨 Diseñado por Juan Carlos Holguín | Getsumi Design Architect', 105, 270, { align: 'center' });
  
  // ========== GUARDAR ==========
  doc.save(`KillerJobs_${user?.name || 'Candidato'}_${Date.now()}.pdf`);
};
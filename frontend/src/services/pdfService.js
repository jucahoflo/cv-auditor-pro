import jsPDF from 'jspdf';

export const generatePDF = (analysis, fileName, jobDescription, user) => {
  try {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(22);
    doc.text('KILLERJOBS', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Auditoría de CV con IA', 105, 35, { align: 'center' });
    
    // Datos
    doc.setFontSize(10);
    doc.text(`Candidato: ${user?.name || 'N/A'}`, 20, 55);
    doc.text(`CV: ${fileName || 'N/A'}`, 20, 62);
    doc.text(`Puntuación: ${analysis.score || 0}%`, 20, 69);
    
    // Fortalezas
    let y = 90;
    doc.setFontSize(12);
    doc.text('Fortalezas:', 20, y);
    y += 7;
    doc.setFontSize(9);
    if (analysis.strengths?.length) {
      analysis.strengths.forEach((s) => {
        doc.text(`• ${s}`, 25, y);
        y += 6;
      });
    }
    
    doc.save(`KillerJobs_${user?.name || 'Candidato'}.pdf`);
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
};
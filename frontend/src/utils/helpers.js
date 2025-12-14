export const downloadPDF = (content, filename = 'meeting-minutes.pdf') => {
  const { jsPDF } = window.jspdf || require('jspdf');
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin;

  // Split text into lines
  const lines = doc.splitTextToSize(content, maxWidth);
  
  let y = margin;
  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 7;
  });

  doc.save(filename);
};

export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element directly to a downloadable PDF file.
 * @param {HTMLElement} element - The DOM element to convert to PDF.
 * @param {string} filename - The output PDF filename.
 */
export async function exportElementToPdf(element, filename = 'invoice.pdf') {
  if (!element) {
    throw new Error('Element to export is not provided');
  }

  // Ensure clean filename ending with .pdf
  const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Render to canvas with high resolution
  const canvas = await html2canvas(element, {
    scale: 2.2, // High resolution for crisp text & graphics
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth || 800
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Margins in mm
  const margin = 6;
  const contentWidth = pdfWidth - (margin * 2);
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // Single page if it fits comfortably
  if (contentHeight <= pdfHeight - (margin * 2)) {
    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
  } else {
    // Multi-page export
    const pageUsableHeight = pdfHeight - (margin * 2);
    let heightLeft = contentHeight;
    let page = 0;

    while (heightLeft > 0) {
      if (page > 0) {
        pdf.addPage();
      }
      const position = margin - (page * pageUsableHeight);
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= pageUsableHeight;
      page++;
    }
  }

  // Trigger automatic download in PDF format
  pdf.save(safeFilename);
  return safeFilename;
}

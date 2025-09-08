import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export data to CSV format
export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export data to Excel format (using CSV with .xlsx extension)
export const exportToExcel = (data: any[], filename: string) => {
  // For now, we'll use CSV format with .xlsx extension
  // In a production app, you might want to use a library like xlsx
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join('\t'), // Use tabs for better Excel compatibility
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && (value.includes('\t') || value.includes(','))
          ? `"${value}"` 
          : value;
      }).join('\t')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export chart/component to PDF
export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1f1f1f',
      scale: 2,
      logging: false,
      allowTaint: true,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Format data for export
export const formatChartDataForExport = (data: any[], chartType: string) => {
  const timestamp = new Date().toISOString();
  
  return data.map(item => ({
    ...item,
    exported_at: timestamp,
    chart_type: chartType,
  }));
};

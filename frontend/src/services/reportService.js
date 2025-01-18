// src/services/reportService.js
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generateReport = (patientData, imageData, predictionResults) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Helper function for centered text
    const centerText = (text, y) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    centerText('Histopathological Analysis Report', 20);

    // Report Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Date: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 30);
    doc.text(`Report ID: HS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 20, 35);

    // Patient Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([
        `Patient Name: ${patientData.name}`,
        `Age: ${patientData.age} years`,
        `Gender: ${patientData.gender}`,
        `Clinical History: ${patientData.clinicalHistory}`
    ], 20, 55);

    // Dividing Line
    doc.setLineWidth(0.5);
    doc.line(20, 85, pageWidth - 20, 85);

    // Image Section
    if (imageData) {
        doc.addImage(imageData, 'JPEG', 20, 95, 80, 80);
    }

    // Analysis Results
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Analysis Results', 110, 100);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([
        `Classification: ${predictionResults.class}`,
        `Confidence Score: ${(predictionResults.probability * 100).toFixed(1)}%`,
        `Analysis Timestamp: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`
    ], 110, 110);

    // Footer
    doc.setFontSize(8);
    doc.text('This is an AI-assisted analysis and should be reviewed by a qualified healthcare professional.', 20, 280);

    // Save the PDF
    const fileName = `histopath_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    doc.save(fileName);
};
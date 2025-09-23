import jsPDF from 'jspdf';
import { Inspection, WorkPermit } from '../types';

export class PDFGenerator {
  // Generar PDF de inspección
  static generateInspectionPDF(inspection: Inspection) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE INSPECCIÓN DATA CENTER', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Información general
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date(inspection.date).toLocaleDateString('es-ES')}`, margin, yPosition);
    doc.text(`Hora: ${inspection.time}`, pageWidth - margin - 50, yPosition);
    yPosition += 10;

    doc.text(`Data Center: ${inspection.datacenter}`, margin, yPosition);
    doc.text(`Turno: ${inspection.shift === 'morning' ? 'Mañana' : 'Tarde'}`, pageWidth - margin - 50, yPosition);
    yPosition += 10;

    doc.text(`Inspector: ${inspection.inspector}`, margin, yPosition);
    yPosition += 20;

    // Línea separadora
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Checklist por categorías
    const categories = {
      clima: 'OPERACIONES DE CLIMA Y CONTROL',
      electrico: 'INSTALACIONES ELÉCTRICAS',
      seguridad: 'SEGURIDAD'
    };

    Object.entries(categories).forEach(([categoryKey, categoryName]) => {
      const categoryItems = inspection.checklist.filter(item => item.category === categoryKey);
      
      if (categoryItems.length > 0) {
        // Título de categoría
        doc.setFont('helvetica', 'bold');
        doc.text(categoryName, margin, yPosition);
        yPosition += 10;

        // Items de la categoría
        doc.setFont('helvetica', 'normal');
        categoryItems.forEach((item, index) => {
          const status = item.completed ? '✓' : '✗';
          const statusColor = item.completed ? [0, 128, 0] : [255, 0, 0];
          
          // Verificar si necesitamos una nueva página
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 30;
          }

          doc.setTextColor(...statusColor);
          doc.text(status, margin, yPosition);
          doc.setTextColor(0, 0, 0);
          
          // Texto del item (con wrap si es muy largo)
          const splitText = doc.splitTextToSize(item.description, pageWidth - margin - 30);
          doc.text(splitText, margin + 10, yPosition);
          yPosition += splitText.length * 5 + 5;

          // Observaciones si existen
          if (item.observations) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            const obsText = doc.splitTextToSize(`Obs: ${item.observations}`, pageWidth - margin - 30);
            doc.text(obsText, margin + 15, yPosition);
            yPosition += obsText.length * 4 + 5;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
          }
        });
        yPosition += 10;
      }
    });

    // Observaciones generales
    if (inspection.generalObservations) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES GENERALES:', margin, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      const obsText = doc.splitTextToSize(inspection.generalObservations, pageWidth - margin * 2);
      doc.text(obsText, margin, yPosition);
      yPosition += obsText.length * 5 + 20;
    }

    // Sección de firmas
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('FIRMAS:', margin, yPosition);
    yPosition += 20;

    // Líneas para firmas
    const signatureWidth = 60;
    const signatureSpacing = (pageWidth - margin * 2 - signatureWidth * 2) / 3;

    doc.line(margin, yPosition, margin + signatureWidth, yPosition);
    doc.line(margin + signatureWidth + signatureSpacing, yPosition, margin + signatureWidth * 2 + signatureSpacing, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Inspector', margin + signatureWidth / 2, yPosition, { align: 'center' });
    doc.text('Supervisor', margin + signatureWidth + signatureSpacing + signatureWidth / 2, yPosition, { align: 'center' });

    // Guardar PDF
    const fileName = `Inspeccion_${inspection.datacenter}_${inspection.date}_${inspection.shift}.pdf`;
    doc.save(fileName);
  }

  // Generar PDF de permiso de trabajo
  static generateWorkPermitPDF(workPermit: WorkPermit) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ANEXO1', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text('PERMISO DE TRABAJO O ACTIVIDAD EN DATA CENTER', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 25;

    // Información personal
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Nombre:', margin, yPosition);
    doc.line(margin + 25, yPosition, pageWidth - margin, yPosition);
    doc.text(workPermit.name, margin + 30, yPosition - 2);
    yPosition += 15;

    doc.text('Identificación:', margin, yPosition);
    doc.line(margin + 35, yPosition, pageWidth - margin, yPosition);
    doc.text(workPermit.identification, margin + 40, yPosition - 2);
    yPosition += 15;

    doc.text('Empresa:', margin, yPosition);
    doc.line(margin + 25, yPosition, pageWidth - margin, yPosition);
    doc.text(workPermit.company, margin + 30, yPosition - 2);
    yPosition += 15;

    doc.text('Motivo del acceso:', margin, yPosition);
    yPosition += 8;
    const reasonLines = doc.splitTextToSize(workPermit.accessReason, pageWidth - margin * 2);
    reasonLines.forEach((line: string, index: number) => {
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      if (index === 0) doc.text(line, margin + 2, yPosition - 2);
      yPosition += 8;
    });
    yPosition += 5;

    doc.text('Equipos o herramientas que ingresan:', margin, yPosition);
    yPosition += 8;
    if (workPermit.equipmentTools) {
      const equipmentLines = doc.splitTextToSize(workPermit.equipmentTools, pageWidth - margin * 2);
      equipmentLines.forEach((line: string, index: number) => {
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        if (index === 0) doc.text(line, margin + 2, yPosition - 2);
        yPosition += 8;
      });
    } else {
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    }
    yPosition += 10;

    // Fechas y horas
    doc.text(`Fecha de ingreso: ${new Date(workPermit.entryDate).toLocaleDateString('es-ES')}`, margin, yPosition);
    doc.text(`Hora de ingreso: ${workPermit.entryTime}`, margin + 80, yPosition);
    yPosition += 15;

    if (workPermit.exitDate && workPermit.exitTime) {
      doc.text(`Fecha de salida: ${new Date(workPermit.exitDate).toLocaleDateString('es-ES')}`, margin, yPosition);
      doc.text(`Hora de salida: ${workPermit.exitTime}`, margin + 80, yPosition);
    } else {
      doc.text('Fecha de salida: ___/___/______', margin, yPosition);
      doc.text('Hora de salida: ___:___', margin + 80, yPosition);
    }
    yPosition += 25;

    // Persona que autoriza
    doc.text('Persona que autoriza el acceso (nombre y cargo):', margin, yPosition);
    yPosition += 10;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    doc.text(workPermit.authorizedPerson, margin + 2, yPosition - 2);
    yPosition += 20;

    // Observaciones
    doc.text('Observaciones:', margin, yPosition);
    yPosition += 10;
    
    const observationLines = 10;
    for (let i = 0; i < observationLines; i++) {
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      if (i === 0 && workPermit.observations) {
        const obsLines = doc.splitTextToSize(workPermit.observations, pageWidth - margin * 2);
        obsLines.forEach((line: string, lineIndex: number) => {
          if (lineIndex + i < observationLines) {
            doc.text(line, margin + 2, yPosition - 2);
            if (lineIndex < obsLines.length - 1) {
              yPosition += 8;
              i++;
            }
          }
        });
      }
      yPosition += 8;
    }
    yPosition += 15;

    // Firmas
    const signatureY = yPosition;
    doc.text('Firma Proveedor:', margin, signatureY);
    doc.line(margin + 40, signatureY + 5, margin + 100, signatureY + 5);
    if (workPermit.providerSignature) {
      doc.text(workPermit.providerSignature, margin + 45, signatureY + 3);
    }

    doc.text('Firma DC Manager:', margin, signatureY + 25);
    doc.line(margin + 40, signatureY + 30, margin + 100, signatureY + 30);
    if (workPermit.dcManagerSignature) {
      doc.text(workPermit.dcManagerSignature, margin + 45, signatureY + 28);
    }

    doc.text('Firma Colaborador:', margin, signatureY + 50);
    doc.line(margin + 40, signatureY + 55, margin + 100, signatureY + 55);
    if (workPermit.collaboratorSignature) {
      doc.text(workPermit.collaboratorSignature, margin + 45, signatureY + 53);
    }

    // Guardar PDF
    const fileName = `Permiso_Trabajo_${workPermit.id}_${workPermit.entryDate}.pdf`;
    doc.save(fileName);
  }
}
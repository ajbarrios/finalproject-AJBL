import { Patient, DietPlan, WorkoutPlan } from '../generated/prisma';

// TODO: Este es un servicio PDF temporal para TB-019
// Debe ser reemplazado por la implementación completa de TB-018

interface GenerateCombinedPDFOptions {
  patient: Patient;
  dietPlan?: DietPlan | null;
  workoutPlan?: WorkoutPlan | null;
}

/**
 * Servicio temporal de PDF hasta que TB-018 esté implementado
 * @deprecated Este servicio será reemplazado por la implementación de TB-018
 */
class PDFService {
  
  /**
   * Genera un PDF combinado de planes de dieta y entrenamiento
   * TODO: Implementar generación real de PDF en TB-018
   */
  async generateCombinedPlansPDF(options: GenerateCombinedPDFOptions): Promise<Buffer> {
    try {
      const { patient, dietPlan, workoutPlan } = options;
      
      // TODO: Implementar generación real de PDF con pdfkit o similar
      // Por ahora, generamos un PDF de placeholder con texto simple
      
      const pdfContent = this.generatePlaceholderPDF(patient, dietPlan, workoutPlan);
      
      // Convertir el contenido del PDF a Buffer
      // TODO: Reemplazar con generación real de PDF
      return Buffer.from(pdfContent, 'utf-8');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Genera contenido de PDF de placeholder temporal
   * TODO: Reemplazar con template real de PDF en TB-018
   */
  private generatePlaceholderPDF(
    patient: Patient, 
    dietPlan?: DietPlan | null, 
    workoutPlan?: WorkoutPlan | null
  ): string {
    const currentDate = new Date().toLocaleDateString('es-ES');
    
    return `
NUTRITRACK PRO - PLAN PERSONALIZADO
===================================

Paciente: ${patient.firstName} ${patient.lastName}
Email: ${patient.email || 'No especificado'}
Fecha de generación: ${currentDate}

===================================

${dietPlan ? `
PLAN DE DIETA: ${dietPlan.title}
-----------------------------------
Descripción: ${dietPlan.description || 'Sin descripción'}
Fecha inicio: ${dietPlan.startDate?.toLocaleDateString('es-ES') || 'No especificada'}
Fecha fin: ${dietPlan.endDate?.toLocaleDateString('es-ES') || 'No especificada'}
Objetivos: ${dietPlan.objectives || 'No especificados'}
Estado: ${dietPlan.isActive ? 'Activo' : 'Inactivo'}

TODO: Implementar contenido detallado de comidas en TB-018
` : ''}

${workoutPlan ? `
PLAN DE ENTRENAMIENTO: ${workoutPlan.title}
-------------------------------------------
Descripción: ${workoutPlan.description || 'Sin descripción'}
Fecha inicio: ${workoutPlan.startDate?.toLocaleDateString('es-ES') || 'No especificada'}
Fecha fin: ${workoutPlan.endDate?.toLocaleDateString('es-ES') || 'No especificada'}
Objetivos: ${workoutPlan.objectives || 'No especificados'}
Estado: ${workoutPlan.isActive ? 'Activo' : 'Inactivo'}

TODO: Implementar contenido detallado de ejercicios en TB-018
` : ''}

===================================
NOTA: Este es un PDF temporal generado por el sistema.
La implementación completa será desarrollada en TB-018.
===================================

NutriTrack Pro - Tu salud, nuestro compromiso
Generado automáticamente el ${currentDate}
    `;
  }

  /**
   * Genera nombre de archivo descriptivo para el PDF
   */
  generateFileName(patient: Patient, includeDate: boolean = true): string {
    const patientName = `${patient.firstName}_${patient.lastName}`.replace(/\s+/g, '_');
    const dateStr = includeDate ? `_${new Date().toISOString().split('T')[0]}` : '';
    return `${patientName}_plan${dateStr}.pdf`;
  }
}

// Exportar instancia singleton
export const pdfService = new PDFService();

// Exportar también la clase para testing
export { PDFService }; 
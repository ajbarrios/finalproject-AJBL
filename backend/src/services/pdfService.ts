import PDFDocument from 'pdfkit';
import { Patient, DietPlan, WorkoutPlan, DietMeal, WorkoutDay, Exercise, MealType, DayOfWeek } from '../generated/prisma';

// Tipos para el PDF enriquecido con relaciones
interface DietPlanWithMeals extends DietPlan {
  meals: DietMeal[];
}

interface WorkoutDayWithExercises extends WorkoutDay {
  exercises: Exercise[];
}

interface WorkoutPlanWithDays extends WorkoutPlan {
  days: WorkoutDayWithExercises[];
}

interface GenerateCombinedPDFOptions {
  patient: Patient;
  dietPlan?: DietPlanWithMeals | null;
  workoutPlan?: WorkoutPlanWithDays | null;
  professional?: {
    firstName: string;
    lastName: string;
    profession: string;
  };
}

// Configuración de diseño del PDF
interface PDFDesignConfig {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    light: string;
  };
  fonts: {
    title: number;
    subtitle: number;
    body: number;
    caption: number;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Servicio para generar PDFs combinados de planes de dieta y entrenamiento
 */
class PDFService {
  
  private readonly designConfig: PDFDesignConfig = {
    colors: {
      primary: '#4F46E5',    // Indigo principal de NutriTrack Pro
      secondary: '#6366F1',  // Indigo medio
      text: '#1F2937',       // Gris oscuro
      accent: '#8B5CF6',     // Violeta
      light: '#F3F4F6'       // Gris muy claro
    },
    fonts: {
      title: 18,
      subtitle: 14,
      body: 11,
      caption: 9
    },
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    }
  };
  
  /**
   * Genera un PDF combinado de planes de dieta y entrenamiento
   */
  async generateCombinedPlansPDF(options: GenerateCombinedPDFOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const { patient, dietPlan, workoutPlan, professional } = options;
        
        // Crear nuevo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          margins: this.designConfig.margins,
          info: {
            Title: `Plan de ${patient.firstName} ${patient.lastName}`,
            Author: 'NutriTrack Pro',
            Subject: 'Plan de Dieta y Entrenamiento',
            Creator: 'NutriTrack Pro',
            Producer: 'NutriTrack Pro',
            CreationDate: new Date()
          }
        });

        const buffers: Buffer[] = [];
        
        // Capturar datos del stream
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // Generar contenido del PDF
        this.generatePDFContent(doc, { patient, dietPlan, workoutPlan, professional });
        
        // Finalizar documento
        doc.end();
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  /**
   * Genera el contenido principal del PDF
   */
  private generatePDFContent(
    doc: PDFKit.PDFDocument, 
    options: GenerateCombinedPDFOptions
  ): void {
    const { patient, dietPlan, workoutPlan, professional } = options;
    
    // Header y título
    this.addHeader(doc);
    
    // Información del paciente  
    this.addPatientInfo(doc, patient);
    
    // Información del profesional
    if (professional) {
      this.addProfessionalInfo(doc, professional);
    }
    
    // Separador
    this.addSeparator(doc);
    
    // Plan de dieta (si existe)
    if (dietPlan) {
      this.addDietPlanSection(doc, dietPlan);
      this.addPageBreakIfNeeded(doc);
    }
    
    // Plan de entrenamiento (si existe)  
    if (workoutPlan) {
      this.addWorkoutPlanSection(doc, workoutPlan);
    }
    
    // Footer
    this.addFooter(doc);
  }

  /**
   * Añade el header principal del PDF
   */
  private addHeader(doc: PDFKit.PDFDocument): void {
    const { colors, fonts } = this.designConfig;
    
    doc.moveDown(1.5);
    
    // Título principal en negrita y grande
    doc.fontSize(fonts.title + 8)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('NUTRITRACK PRO', { align: 'center' });
       
    doc.fontSize(fonts.subtitle + 4)
       .font('Helvetica')
       .fillColor(colors.secondary)
       .text('PLAN PERSONALIZADO', { align: 'center' });
       
    doc.moveDown(2.5);
  }

  /**
   * Añade información del paciente
   */
  private addPatientInfo(doc: PDFKit.PDFDocument, patient: Patient): void {
    const { colors, fonts } = this.designConfig;
    
    // Título de sección con background
    const sectionY = doc.y;
    doc.rect(50, sectionY, 500, 35)
       .fill(colors.light)
       .stroke(colors.primary);
    
    doc.fontSize(fonts.subtitle + 2)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('INFORMACIÓN DEL PACIENTE', 50, sectionY + 8, {
         width: 500,
         align: 'center'
       });
    
    doc.y = sectionY + 35;
    doc.moveDown(1);
       
    doc.font('Helvetica');
    
    // Información básica con etiquetas en negrita
    doc.fontSize(fonts.body + 1)
       .font('Helvetica-Bold')
       .fillColor(colors.secondary)
       .text('Nombre:', 70, doc.y, { continued: true })
       .font('Helvetica')
       .fillColor(colors.text)
       .text(` ${patient.firstName} ${patient.lastName}`);
    doc.moveDown(0.5);
    
    doc.font('Helvetica-Bold')
       .fillColor(colors.secondary)
       .text('Email:', 70, doc.y, { continued: true })
       .font('Helvetica')
       .fillColor(colors.text)
       .text(` ${patient.email || 'No especificado'}`);
    doc.moveDown(0.5);
    
    doc.font('Helvetica-Bold')
       .fillColor(colors.secondary)
       .text('Teléfono:', 70, doc.y, { continued: true })
       .font('Helvetica')
       .fillColor(colors.text)
       .text(` ${patient.phone || 'No especificado'}`);
    doc.moveDown(0.5);
       
    if (patient.birthDate) {
      const age = this.calculateAge(patient.birthDate);
      doc.font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Edad:', 70, doc.y, { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${age} años`);
      doc.moveDown(0.5);
    }
    
    if (patient.height) {
      doc.font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Altura:', 70, doc.y, { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${patient.height} cm`);
      doc.moveDown(0.5);
    }

    if (patient.gender) {
      doc.font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Género:', 70, doc.y, { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${patient.gender || 'Prefiero no especificar'}`);
      doc.moveDown(0.5);
    }

    if (patient.objectives) {
      doc.font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Objetivos:', 70, doc.y, { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${patient.objectives}`);
      doc.moveDown(0.5);
    }

    if (patient.dietRestrictions) {
      doc.font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Restricciones dietéticas:', 70, doc.y, { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${patient.dietRestrictions}`);
      doc.moveDown(0.5);
    }
    
    doc.moveDown(1.5);
  }

  /**
   * Añade información del profesional
   */
  private addProfessionalInfo(doc: PDFKit.PDFDocument, professional: { firstName: string; lastName: string; profession: string }): void {
    const { colors, fonts } = this.designConfig;
    
    // Box elegante para información del profesional
    const profY = doc.y;
    doc.rect(320, profY, 230, 50)
       .fill(colors.accent)
       .stroke(colors.primary);
    
    doc.fontSize(fonts.body)
       .font('Helvetica-Bold')
       .fillColor('white')
       .text('PROFESIONAL:', 320, profY + 5, {
         width: 230,
         align: 'center'
       });
    
    doc.fontSize(fonts.body - 1)
       .font('Helvetica')
       .fillColor('white')
       .text(`${professional.firstName} ${professional.lastName}`, 320, profY + 22, {
         width: 230,
         align: 'center'
       })
       .text(`${this.translateProfession(professional.profession)}`, 320, profY + 35, {
         width: 230,
         align: 'center'
       });
       
    doc.y = profY + 50;
    doc.moveDown(1);
  }

  /**
   * Añade la sección del plan de dieta
   */
  private addDietPlanSection(doc: PDFKit.PDFDocument, dietPlan: DietPlanWithMeals): void {
    const { colors, fonts } = this.designConfig;
    
    // Separador visual
    this.addSectionSeparator(doc);
    
    // Título de sección con background llamativo
    const titleY = doc.y;
    doc.rect(50, titleY, 500, 40)
       .fill(colors.accent);
    
    doc.fontSize(fonts.title + 2)
       .font('Helvetica-Bold')
       .fillColor('white')
       .text('PLAN DE ALIMENTACIÓN', 50, titleY + 12, { 
         width: 500,
         align: 'center'
       });
    
    doc.y = titleY + 40;
    doc.moveDown(1);
       
    // Información del plan con jerarquía visual
    doc.fontSize(fonts.subtitle + 1)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text(dietPlan.title);
    
    doc.moveDown(0.8);
       
    doc.font('Helvetica');
       
    if (dietPlan.description) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Descripción:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${dietPlan.description}`);
      doc.moveDown(0.6);
    }
    
    if (dietPlan.startDate && dietPlan.endDate) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Período:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${this.formatDate(dietPlan.startDate)} - ${this.formatDate(dietPlan.endDate)}`);
      doc.moveDown(0.6);
    }
    
    if (dietPlan.objectives) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Objetivos:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${dietPlan.objectives}`);
      doc.moveDown(0.6);
    }
    
    doc.moveDown(1);
    
    // Comidas agrupadas por día
    this.addMealsTable(doc, dietPlan.meals);
    
    doc.moveDown(2);
  }

  /**
   * Añade tabla de comidas organizadas por día
   */
  private addMealsTable(doc: PDFKit.PDFDocument, meals: DietMeal[]): void {
    const { colors, fonts } = this.designConfig;
    
    // Agrupar comidas por día de la semana
    const mealsByDay = this.groupMealsByDay(meals);
    
    doc.fontSize(fonts.subtitle)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('COMIDAS POR DÍA');
    
    doc.moveDown(1);
    
    // Iterar por cada día de la semana
    Object.entries(mealsByDay).forEach(([day, dayMeals]) => {
      if (dayMeals.length === 0) return;
      
      // Box elegante para el día
      const dayY = doc.y;
      doc.rect(50, dayY, 500, 25)
         .fill(colors.primary)
         .stroke(colors.accent);
      
      // Nombre del día en negrita y blanco
      doc.fontSize(fonts.body + 2)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text(this.translateDayOfWeek(day as DayOfWeek).toUpperCase(), 50, dayY + 6, {
           width: 500,
           align: 'center'
         });
      
      doc.y = dayY + 25;
      doc.moveDown(0.5);
      
      // Comidas del día con formato elegante
      dayMeals.forEach(meal => {
        doc.fontSize(fonts.body)
           .font('Helvetica-Bold')
           .fillColor(colors.secondary)
           .text(`    ${this.translateMealType(meal.mealType)}:`, { continued: true })
           .font('Helvetica')
           .fillColor(colors.text)
           .text(` ${meal.content}`);
        doc.moveDown(0.4);
      });
      
      doc.moveDown(0.8);
    });
  }

  /**
   * Añade la sección del plan de entrenamiento
   */
  private addWorkoutPlanSection(doc: PDFKit.PDFDocument, workoutPlan: WorkoutPlanWithDays): void {
    const { colors, fonts } = this.designConfig;
    
    // Separador visual
    this.addSectionSeparator(doc);
    
    // Título de sección con background destacado
    const titleY = doc.y;
    doc.rect(50, titleY, 500, 40)
       .fill(colors.primary);
    
    doc.fontSize(fonts.title + 2)
       .font('Helvetica-Bold')
       .fillColor('white')
       .text('PLAN DE ENTRENAMIENTO', 50, titleY + 12, {
         width: 500,
         align: 'center'
       });
    
    doc.y = titleY + 40;
    doc.moveDown(1);
       
    // Información del plan con jerarquía visual
    doc.fontSize(fonts.subtitle + 1)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text(workoutPlan.title);
    
    doc.moveDown(0.8);
       
    doc.font('Helvetica');
       
    if (workoutPlan.description) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Descripción:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${workoutPlan.description}`);
      doc.moveDown(0.6);
    }
    
    if (workoutPlan.startDate && workoutPlan.endDate) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Período:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${this.formatDate(workoutPlan.startDate)} - ${this.formatDate(workoutPlan.endDate)}`);
      doc.moveDown(0.6);
    }
    
    if (workoutPlan.objectives) {
      doc.fontSize(fonts.body + 1)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Objetivos:', { continued: true })
         .font('Helvetica')
         .fillColor(colors.text)
         .text(` ${workoutPlan.objectives}`);
      doc.moveDown(0.6);
    }
    
    doc.moveDown(1);
    
    // Días de entrenamiento
    this.addWorkoutDays(doc, workoutPlan.days);
    
    doc.moveDown(2);
  }

  /**
   * Añade los días de entrenamiento con ejercicios
   */
  private addWorkoutDays(doc: PDFKit.PDFDocument, days: WorkoutDayWithExercises[]): void {
    const { colors, fonts } = this.designConfig;
    
    doc.fontSize(fonts.subtitle)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('RUTINA SEMANAL');
    
    doc.moveDown(1);
    
    days.forEach(day => {
      // Box elegante para el día
      const dayY = doc.y;
      doc.rect(50, dayY, 500, 25)
         .fill(colors.accent)
         .stroke(colors.primary);
      
      // Nombre del día en negrita y blanco
      doc.fontSize(fonts.body + 2)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text(this.translateDayOfWeek(day.dayOfWeek).toUpperCase(), 50, dayY + 6, {
           width: 500,
           align: 'center'
         });
      
      doc.y = dayY + 25;
      doc.moveDown(0.5);
      
      if (day.description) {
        doc.fontSize(fonts.caption + 2)
           .font('Helvetica-Oblique')
           .fillColor(colors.secondary)
           .text(`    ${day.description}`);
        doc.moveDown(0.6);
      }
      
      // Ejercicios del día con formato profesional
      day.exercises.forEach((exercise, index) => {
        doc.fontSize(fonts.body)
           .font('Helvetica-Bold')
           .fillColor(colors.primary)
           .text(`    ${index + 1}. ${exercise.name}`, { continued: true })
           .font('Helvetica')
           .fillColor(colors.text)
           .text(` - ${exercise.setsReps}`);
           
        if (exercise.observations) {
          doc.fontSize(fonts.caption + 1)
             .font('Helvetica-Oblique')
             .fillColor(colors.secondary)
             .text(`        Nota: ${exercise.observations}`);
        }
        doc.moveDown(0.4);
      });
      
      doc.moveDown(1);
    });
  }

  /**
   * Añade separador visual
   */
  private addSeparator(doc: PDFKit.PDFDocument): void {
    const currentY = doc.y;
    doc.moveTo(this.designConfig.margins.left, currentY)
       .lineTo(doc.page.width - this.designConfig.margins.right, currentY)
       .strokeColor(this.designConfig.colors.secondary)
       .stroke();
    doc.moveDown(0.5);
  }

  /**
   * Añade un separador visual más prominente entre secciones
   */
  private addSectionSeparator(doc: PDFKit.PDFDocument): void {
    const { colors } = this.designConfig;
    
    doc.moveDown(0.5);
    
    // Línea doble para separación visual
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke(colors.accent);
       
    doc.moveTo(50, doc.y + 3)
       .lineTo(550, doc.y + 3)
       .stroke(colors.light);
       
    doc.moveDown(1);
  }

  /**
   * Añade footer con fecha e información
   */
  private addFooter(doc: PDFKit.PDFDocument): void {
    const { colors, fonts } = this.designConfig;
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    // Posicionar footer en la parte inferior
    const footerY = doc.page.height - this.designConfig.margins.bottom;
    doc.y = footerY - 60;
    
    // Línea decorativa superior del footer
    doc.moveTo(100, doc.y)
       .lineTo(500, doc.y)
       .lineWidth(2)
       .stroke(colors.accent);
    
    doc.moveDown(0.8);
    
    doc.fontSize(fonts.caption + 1)
       .font('Helvetica')
       .fillColor(colors.secondary)
       .text(`Generado por NutriTrack Pro el ${currentDate}`, { align: 'center' });
    
    doc.moveDown(0.4);
    
    doc.fontSize(fonts.caption)
       .font('Helvetica-Bold')
       .fillColor(colors.primary)
       .text('Tu salud, nuestro compromiso', { align: 'center' });
  }

  /**
   * Añade salto de página si es necesario
   */
  private addPageBreakIfNeeded(doc: PDFKit.PDFDocument): void {
    if (doc.y > doc.page.height - 150) { // 150px del final
      doc.addPage();
    }
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Calcula la edad a partir de la fecha de nacimiento
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formatea una fecha para mostrar en español
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }

  /**
   * Agrupa las comidas por día de la semana
   */
  private groupMealsByDay(meals: DietMeal[]): Record<DayOfWeek, DietMeal[]> {
    const days: Record<DayOfWeek, DietMeal[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: []
    };
    
    meals.forEach(meal => {
      days[meal.dayOfWeek].push(meal);
    });
    
    return days;
  }

  /**
   * Traduce el día de la semana a español
   */
  private translateDayOfWeek(day: DayOfWeek): string {
    const translations = {
      MONDAY: 'Lunes',
      TUESDAY: 'Martes',
      WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves',
      FRIDAY: 'Viernes',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo'
    };
    return translations[day] || day;
  }

  /**
   * Traduce el tipo de comida a español
   */
  private translateMealType(mealType: MealType): string {
    const translations = {
      BREAKFAST: 'Desayuno',
      MID_MORNING_SNACK: 'Media mañana',
      LUNCH: 'Almuerzo',
      AFTERNOON_SNACK: 'Merienda',
      DINNER: 'Cena',
      LATE_NIGHT_SNACK: 'Resopón'
    };
    return translations[mealType] || mealType;
  }



  /**
   * Traduce el tipo de profesión a español
   */
  private translateProfession(profession: string): string {
    const translations: Record<string, string> = {
      'NUTRITIONIST': 'Nutricionista',
      'TRAINER': 'Entrenador Personal'
    };
    return translations[profession] || profession;
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
import nodemailer from 'nodemailer';
import { Patient, DietPlan, WorkoutPlan } from '../generated/prisma';

// Interfaces para mejor tipado
interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface SendPlanEmailOptions {
  to: string;
  subject: string;
  bodyMessage?: string;
  attachments?: EmailAttachment[];
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  recipient: string;
  timestamp: Date;
}

/**
 * Servicio para el envío de emails usando Nodemailer con Gmail
 */
class EmailService {
  private transporter!: nodemailer.Transporter;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Inicializa el transporter de Nodemailer con configuración de Gmail
   */
  private initializeTransporter(): void {
    try {
      // Validar variables de entorno requeridas
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;
      const fromName = process.env.FROM_NAME;

      if (!emailUser || !emailPass) {
        console.error('❌ Email configuration missing: EMAIL_USER and EMAIL_PASS are required');
        throw new Error('Email credentials (EMAIL_USER, EMAIL_PASS) not configured');
      }

      if (!fromName) {
        console.warn('⚠️ FROM_NAME not configured, using default');
      }

      // Configurar transporter para Gmail
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass, // App Password de Gmail
        },
      });

      this.isConfigured = true;
      console.log('📧 Email service initialized with Gmail configuration');

      // Verificar conexión en background
      this.verifyConnection();

    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.isConfigured = false;
      throw error;
    }
  }

  /**
   * Verifica la conexión SMTP de forma asíncrona
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified successfully');
    } catch (error) {
      console.error('❌ Email service connection verification failed:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Genera el template HTML para los emails de planes
   */
  private generateEmailTemplate(bodyMessage: string, patientName?: string): string {
    const greeting = patientName ? `Hola ${patientName},` : 'Hola,';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NutriTrack Pro - Tu Plan Personalizado</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <header style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              NutriTrack Pro
            </h1>
            <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">
              Tu salud, nuestro compromiso
            </p>
          </header>
          
          <!-- Main Content -->
          <main style="background-color: white; padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h2 style="color: #059669; margin-top: 0; font-size: 24px; font-weight: 600;">
              📋 Tu Plan Personalizado
            </h2>
            
            <p style="font-size: 16px; margin-bottom: 20px; color: #374151;">
              ${greeting}
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #374151; line-height: 1.7;">
              ${bodyMessage || 'Tu profesional de confianza ha preparado un plan personalizado especialmente para ti.'}
            </p>
            
            <!-- Info Box -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 20px; border-left: 4px solid #10b981; margin: 25px 0; border-radius: 8px;">
              <p style="margin: 0; font-style: italic; color: #065f46; font-size: 15px;">
                <strong>💡 Información importante:</strong><br>
                Este plan ha sido creado específicamente para ti basándose en tus objetivos y necesidades individuales.
              </p>
            </div>
            
            <!-- Attachment Info -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 25px 0;">
              <p style="margin: 0; color: #475569; font-size: 15px;">
                📎 <strong style="color: #059669;">Adjunto:</strong> Encontrarás tu plan completo en formato PDF listo para descargar e imprimir.
              </p>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Si tienes alguna duda sobre tu plan, no dudes en contactar con tu profesional.
              </p>
            </div>
          </main>
          
          <!-- Footer -->
          <footer style="text-align: center; color: #6b7280; font-size: 14px; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 16px;">
              Saludos cordiales,<br>
              <strong style="color: #059669; font-size: 18px;">El equipo de NutriTrack Pro</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px auto; width: 80%;">
            
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              Este email fue enviado desde NutriTrack Pro.<br>
              Sistema de gestión nutricional y de entrenamiento para profesionales.
            </p>
          </footer>
          
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía un email con planes de dieta/entrenamiento adjuntos
   */
  public async sendPlanEmail(options: SendPlanEmailOptions): Promise<EmailResponse> {
    try {
      // Verificar que el servicio esté configurado
      if (!this.isConfigured) {
        throw new Error('Email service is not properly configured');
      }

      const { to, subject, bodyMessage, attachments = [] } = options;

      // Configurar opciones del email
      const mailOptions = {
        from: `"${process.env.FROM_NAME || 'NutriTrack Pro'}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: this.generateEmailTemplate(bodyMessage || ''),
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      };

      // Enviar el email
      const info = await this.transporter.sendMail(mailOptions);
      
      const response: EmailResponse = {
        success: true,
        messageId: info.messageId,
        recipient: to,
        timestamp: new Date()
      };

      console.log(`📧 Email sent successfully:`, {
        messageId: info.messageId,
        recipient: to,
        subject: subject,
        timestamp: response.timestamp.toISOString()
      });
      
      return response;
      
    } catch (error) {
      console.error('📧 Email sending failed:', error);
      
      // Determinar el tipo de error para mejor debugging
      if (error instanceof Error) {
        if (error.message.includes('Invalid login')) {
          throw new Error('Invalid email credentials. Check EMAIL_USER and EMAIL_PASS configuration.');
        } else if (error.message.includes('Connection timeout')) {
          throw new Error('Email service connection timeout. Check internet connection.');
        } else if (error.message.includes('quota')) {
          throw new Error('Email quota exceeded. Gmail limit is 500 emails per day.');
        }
      }
      
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Método para testing de conexión
   */
  public async testConnection(): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        return false;
      }
      
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  /**
   * Método para obtener información del servicio de email
   */
  public getServiceInfo(): { configured: boolean; user: string | undefined } {
    return {
      configured: this.isConfigured,
      user: process.env.EMAIL_USER
    };
  }
}

// Exportar una instancia singleton del servicio
export const emailService = new EmailService();

// Exportar también la clase para testing
export { EmailService }; 
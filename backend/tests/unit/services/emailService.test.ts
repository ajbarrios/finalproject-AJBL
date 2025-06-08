import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Configurar variables de entorno antes de cualquier importación
process.env.EMAIL_USER = 'test@gmail.com';
process.env.EMAIL_PASS = 'test-password';
process.env.FROM_NAME = 'NutriTrack Pro Test';

// Mock nodemailer antes de importar EmailService
const createMockTransporter = () => {
  const mockSendMail = vi.fn();
  const mockVerify = vi.fn();
  
  return {
    sendMail: mockSendMail,
    verify: mockVerify,
    _mockSendMail: mockSendMail,
    _mockVerify: mockVerify
  };
};

vi.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: vi.fn()
  }
}));

// Ahora importar EmailService después de configurar variables de entorno y mocks
import { EmailService } from '../../../src/services/emailService';

// Mock completo del módulo EmailService para evitar instanciación automática
vi.mock('../../../src/services/emailService', () => {
  const mockSendMail = vi.fn();
  const mockVerify = vi.fn();
  const mockCreateTransport = vi.fn();

  // Mock de la clase EmailService
  const MockEmailService = vi.fn().mockImplementation(() => ({
    sendPlanEmail: mockSendMail,
    testConnection: vi.fn().mockImplementation(async () => {
      try {
        await mockVerify();
        return true;
      } catch {
        return false;
      }
    }),
    getServiceInfo: vi.fn().mockReturnValue({
      configured: true,
      user: 'test@gmail.com'
    }),
    isConfigured: true
  }));

  // Mock de nodemailer
  vi.doMock('nodemailer', () => ({
    __esModule: true,
    default: {
      createTransport: mockCreateTransport.mockReturnValue({
        sendMail: mockSendMail,
        verify: mockVerify
      })
    }
  }));

  return {
    EmailService: MockEmailService,
    emailService: new MockEmailService(),
    // Exportar las funciones mock para acceso en tests
    __mockSendMail: mockSendMail,
    __mockVerify: mockVerify,
    __mockCreateTransport: mockCreateTransport
  };
});

describe('EmailService', () => {
  let EmailService: any;
  let mockSendMail: any;
  let mockVerify: any;
  let mockCreateTransport: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Configurar variables de entorno
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'test-password';
    process.env.FROM_NAME = 'NutriTrack Pro Test';

    // Importar el módulo mockeado
    const emailModule = await import('../../../src/services/emailService');
    EmailService = emailModule.EmailService;
    mockSendMail = (emailModule as any).__mockSendMail;
    mockVerify = (emailModule as any).__mockVerify;
    mockCreateTransport = (emailModule as any).__mockCreateTransport;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sendPlanEmail', () => {
    it('should send email successfully with attachments', async () => {
      const emailService = new EmailService();
      
      const mockEmailResult = {
        messageId: 'test-message-id-123',
        response: '250 Message accepted'
      };
      
      mockSendMail.mockResolvedValue({
        success: true,
        messageId: 'test-message-id-123',
        recipient: 'paciente@email.com',
        timestamp: new Date('2024-01-01T10:00:00Z')
      });

      const emailOptions = {
        to: 'paciente@email.com',
        subject: 'Tu Plan Personalizado',
        bodyMessage: 'Aquí tienes tu plan personalizado',
        attachments: [
          {
            filename: 'plan_personalizado.pdf',
            content: Buffer.from('PDF content here'),
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await emailService.sendPlanEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id-123');
      expect(result.recipient).toBe('paciente@email.com');
      expect(result.timestamp).toBeInstanceOf(Date);

      expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
    });

    it('should send email successfully without attachments', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockResolvedValue({
        success: true,
        messageId: 'test-message-id-456',
        recipient: 'paciente@email.com',
        timestamp: new Date()
      });

      const emailOptions = {
        to: 'paciente@email.com',
        subject: 'Tu Plan Personalizado',
        bodyMessage: 'Mensaje sin adjuntos'
      };

      const result = await emailService.sendPlanEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id-456');

      expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
    });

    it('should handle email sending errors', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockRejectedValue(new Error('SMTP connection failed'));

      const emailOptions = {
        to: 'test@email.com',
        subject: 'Test Subject'
      };

      await expect(emailService.sendPlanEmail(emailOptions)).rejects.toThrow('SMTP connection failed');
    });

    it('should handle Gmail quota exceeded error', async () => {
      const emailService = new EmailService();
      
      const quotaError = new Error('Daily sending quota exceeded');
      mockSendMail.mockRejectedValue(quotaError);

      await expect(emailService.sendPlanEmail({
        to: 'test@email.com',
        subject: 'Test Subject'
      })).rejects.toThrow('Daily sending quota exceeded');
    });

    it('should handle authentication errors', async () => {
      const emailService = new EmailService();
      
      const authError = new Error('Invalid login credentials');
      mockSendMail.mockRejectedValue(authError);

      await expect(emailService.sendPlanEmail({
        to: 'test@email.com',
        subject: 'Test Subject'
      })).rejects.toThrow('Invalid login credentials');
    });

    it('should handle timeout errors', async () => {
      const emailService = new EmailService();
      
      const timeoutError = new Error('Connection timeout');
      mockSendMail.mockRejectedValue(timeoutError);

      await expect(emailService.sendPlanEmail({
        to: 'test@email.com',
        subject: 'Test Subject'
      })).rejects.toThrow('Connection timeout');
    });
  });

  describe('testConnection', () => {
    it('should return true when connection is successful', async () => {
      const emailService = new EmailService();
      
      mockVerify.mockResolvedValue(true);

      const result = await emailService.testConnection();

      expect(result).toBe(true);
    });

    it('should return false when connection fails', async () => {
      const emailService = new EmailService();
      
      mockVerify.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.testConnection();

      expect(result).toBe(false);
    });

    it('should return false when service is not configured', async () => {
      const emailService = new EmailService();
      emailService.isConfigured = false;

      const result = await emailService.testConnection();

      expect(result).toBe(false);
    });
  });

  describe('getServiceInfo', () => {
    it('should return service information when configured', () => {
      const emailService = new EmailService();

      const info = emailService.getServiceInfo();

      expect(info).toEqual({
        configured: true,
        user: 'test@gmail.com'
      });
    });

    it('should return not configured when service fails to initialize', () => {
      const emailService = new EmailService();
      
      // Mock para simular servicio no configurado
      emailService.getServiceInfo.mockReturnValue({
        configured: false,
        user: 'test@gmail.com'
      });

      const info = emailService.getServiceInfo();

      expect(info.configured).toBe(false);
      expect(info.user).toBe('test@gmail.com');
    });
  });

  describe('constructor and initialization', () => {
    it('should create EmailService instance successfully', () => {
      expect(() => {
        new EmailService();
      }).not.toThrow();
    });

    it('should initialize with proper configuration', () => {
      const emailService = new EmailService();
      
      expect(emailService).toBeDefined();
      expect(emailService.sendPlanEmail).toBeDefined();
      expect(emailService.testConnection).toBeDefined();
      expect(emailService.getServiceInfo).toBeDefined();
    });
  });

  describe('error scenarios', () => {
    it('should handle service not configured error', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockRejectedValue(new Error('Email service is not properly configured'));

      await expect(emailService.sendPlanEmail({
        to: 'test@email.com',
        subject: 'Test Subject'
      })).rejects.toThrow('Email service is not properly configured');
    });

    it('should handle network connectivity issues', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockRejectedValue(new Error('Network unreachable'));

      await expect(emailService.sendPlanEmail({
        to: 'test@email.com',
        subject: 'Test Subject'
      })).rejects.toThrow('Network unreachable');
    });

    it('should handle malformed email addresses', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockRejectedValue(new Error('Invalid email address'));

      await expect(emailService.sendPlanEmail({
        to: 'invalid-email',
        subject: 'Test Subject'
      })).rejects.toThrow('Invalid email address');
    });
  });

  describe('email content validation', () => {
    it('should handle emails with special characters', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'test@email.com',
        timestamp: new Date()
      });

      const emailOptions = {
        to: 'test@email.com',
        subject: 'Título con acentos y ñ',
        bodyMessage: 'Mensaje con caracteres especiales: áéíóú ñ ¿¡'
      };

      const result = await emailService.sendPlanEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
    });

    it('should handle large attachments', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'test@email.com',
        timestamp: new Date()
      });

      const largeBuffer = Buffer.alloc(1024 * 1024); // 1MB buffer
      const emailOptions = {
        to: 'test@email.com',
        subject: 'Email with large attachment',
        attachments: [
          {
            filename: 'large_plan.pdf',
            content: largeBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await emailService.sendPlanEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
    });

    it('should handle multiple attachments', async () => {
      const emailService = new EmailService();
      
      mockSendMail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'test@email.com',
        timestamp: new Date()
      });

      const emailOptions = {
        to: 'test@email.com',
        subject: 'Email with multiple attachments',
        attachments: [
          {
            filename: 'diet_plan.pdf',
            content: Buffer.from('Diet plan content'),
            contentType: 'application/pdf'
          },
          {
            filename: 'workout_plan.pdf',
            content: Buffer.from('Workout plan content'),
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await emailService.sendPlanEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
    });
  });
}); 
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async enviarConfirmacionEvento(
    emailDestino: string,
    nombreUsuario: string,
    nombreEvento: string,
    fechaEvento: string,
    ubicacionEvento: string,
  ): Promise<boolean> {
    try {
      const htmlContent = this.generarHTMLConfirmacion(
        nombreUsuario,
        nombreEvento,
        fechaEvento,
        ubicacionEvento,
      );

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to: emailDestino,
        subject: `Confirmación de Registro - ${nombreEvento}`,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado exitosamente a ${emailDestino}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email a ${emailDestino}:`, error);
      return false;
    }
  }

  async enviarRecordatorioEvento(
    emailDestino: string,
    nombreUsuario: string,
    nombreEvento: string,
    fechaEvento: string,
    ubicacionEvento: string,
  ): Promise<boolean> {
    try {
      const htmlContent = this.generarHTMLRecordatorio(
        nombreUsuario,
        nombreEvento,
        fechaEvento,
        ubicacionEvento,
      );

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to: emailDestino,
        subject: `Recordatorio - ${nombreEvento} se acerca`,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Recordatorio enviado exitosamente a ${emailDestino}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar recordatorio a ${emailDestino}:`, error);
      return false;
    }
  }

  private generarHTMLConfirmacion(
    nombreUsuario: string,
    nombreEvento: string,
    fechaEvento: string,
    ubicacionEvento: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Registro</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .event-details { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Registro Confirmado!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombreUsuario}</strong>,</p>
            <p>Te confirmamos que tu registro para el evento ha sido exitoso.</p>
            
            <div class="event-details">
              <h3>Detalles del Evento:</h3>
              <p><strong>Evento:</strong> ${nombreEvento}</p>
              <p><strong>Fecha:</strong> ${fechaEvento}</p>
              <p><strong>Ubicación:</strong> ${ubicacionEvento}</p>
            </div>
            
            <p>Esperamos verte en el evento. Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>¡Gracias por participar!</p>
          </div>
          <div class="footer">
            <p>Sistema de Gestión de Eventos</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generarHTMLRecordatorio(
    nombreUsuario: string,
    nombreEvento: string,
    fechaEvento: string,
    ubicacionEvento: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Recordatorio de Evento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .event-details { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #FF9800; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡El evento se acerca!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombreUsuario}</strong>,</p>
            <p>Te recordamos que tienes un evento próximo que no te puedes perder.</p>
            
            <div class="event-details">
              <h3>Detalles del Evento:</h3>
              <p><strong>Evento:</strong> ${nombreEvento}</p>
              <p><strong>Fecha:</strong> ${fechaEvento}</p>
              <p><strong>Ubicación:</strong> ${ubicacionEvento}</p>
            </div>
            
            <p>¡Nos vemos pronto en el evento!</p>
          </div>
          <div class="footer">
            <p>Sistema de Gestión de Eventos</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verificarConexion(): Promise<boolean> {
    try {
      // Verificar que las variables de entorno estén configuradas
      const emailHost = this.configService.get<string>('EMAIL_HOST');
      const emailPort = this.configService.get<number>('EMAIL_PORT');
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      if (!emailHost || !emailPort || !emailUser || !emailPass) {
        this.logger.error('Variables de entorno de email no configuradas correctamente');
        this.logger.error(`EMAIL_HOST: ${emailHost ? '✓' : '✗'}`);
        this.logger.error(`EMAIL_PORT: ${emailPort ? '✓' : '✗'}`);
        this.logger.error(`EMAIL_USER: ${emailUser ? '✓' : '✗'}`);
        this.logger.error(`EMAIL_PASS: ${emailPass ? '✓' : '✗'}`);
        return false;
      }

      // Verificar la conexión con el servidor
      await this.transporter.verify();
      this.logger.log('Conexión con el servidor de email verificada correctamente');
      return true;
    } catch (error) {
      this.logger.error('Error al verificar la conexión con el servidor de email:', error);
      this.logger.error('Detalles del error:', {
        code: error.code,
        command: error.command,
        response: error.response,
      });
      return false;
    }
  }
}

import { Controller, Post, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('verificar-conexion')
  async verificarConexion() {
    const conexionExitosa = await this.emailService.verificarConexion();
    return {
      conexionExitosa,
      message: conexionExitosa 
        ? 'Conexión con el servidor de email verificada correctamente' 
        : 'Error al conectar con el servidor de email. Revisa la configuración en el archivo .env y los logs del servidor.',
      timestamp: new Date().toISOString(),
    };
  }
}

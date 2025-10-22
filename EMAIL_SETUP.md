# Configuración de Email para el Sistema de Eventos

## Descripción

Se ha agregado la funcionalidad de envío de confirmaciones por correo electrónico al backend del sistema de gestión de eventos. Esta funcionalidad permite:

- Enviar confirmaciones de registro a los participantes
- Enviar recordatorios de eventos próximos
- Verificar la conexión con el servidor de email

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eventos_db
DB_USER=root
DB_PASSWORD=password

# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=tu_email@gmail.com
```

### Configuración para Gmail

Si usas Gmail, necesitarás:

1. Habilitar la verificación en 2 pasos en tu cuenta de Google
2. Generar una contraseña de aplicación:
   - Ve a Google Account > Security > 2-Step Verification > App passwords
   - Genera una nueva contraseña de aplicación
   - Usa esta contraseña en la variable `EMAIL_PASS`

### Otros Proveedores de Email

Para otros proveedores, ajusta las siguientes variables:

- **Outlook/Hotmail**: 
  - EMAIL_HOST=smtp-mail.outlook.com
  - EMAIL_PORT=587
  - EMAIL_SECURE=false

- **Yahoo**: 
  - EMAIL_HOST=smtp.mail.yahoo.com
  - EMAIL_PORT=587
  - EMAIL_SECURE=false

## Endpoints Disponibles

### 1. Verificar Conexión de Email
```
GET /email/verificar-conexion
```
Verifica que la configuración de email esté funcionando correctamente.

### 2. Confirmar Participación
```
POST /eventos/:eventoId/participantes/:usuarioId/confirmar
```
Envía un email de confirmación a un participante específico de un evento.

### 3. Enviar Recordatorio
```
POST /eventos/:eventoId/recordatorio
```
Envía recordatorios por email a todos los participantes registrados en un evento.

## Funcionalidades

### Email de Confirmación
- Se envía cuando un usuario se registra en un evento
- Incluye detalles del evento (nombre, fecha, ubicación)
- Diseño HTML responsivo y profesional

### Email de Recordatorio
- Se envía a todos los participantes de un evento
- Útil para recordar eventos próximos
- Diseño diferenciado del email de confirmación

### Verificación de Conexión
- Permite verificar que la configuración de email esté correcta
- Útil para debugging y configuración inicial

## Estructura de Archivos

```
src/
├── email/
│   ├── email.service.ts      # Servicio principal de email
│   ├── email.controller.ts   # Controlador para endpoints de email
│   └── email.module.ts       # Módulo de email
├── eventos/
│   ├── eventos.service.ts    # Actualizado con funcionalidad de email
│   └── eventos.controller.ts # Actualizado con endpoints de confirmación
└── app.module.ts             # Actualizado para incluir EmailModule
```

## Uso

1. Configura las variables de entorno
2. Inicia el servidor
3. Verifica la conexión: `GET /email/verificar-conexion`
4. Usa los endpoints de eventos para enviar confirmaciones y recordatorios

## Notas Importantes

- Los emails se envían de forma asíncrona
- Se incluye manejo de errores y logging
- Los templates de email son responsivos y profesionales
- La configuración es flexible para diferentes proveedores de email

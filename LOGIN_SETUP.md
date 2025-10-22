# Funcionalidad de Login - Sistema de Eventos

## Descripción

Se ha implementado una funcionalidad simple de login para el sistema de gestión de eventos. Esta implementación es para fines educativos y utiliza autenticación básica sin JWT.

## Características

- ✅ Login simple con usuario y contraseña
- ✅ Validación de credenciales
- ✅ Respuesta con datos del usuario (sin contraseña)
- ✅ Manejo de errores (usuario no encontrado, contraseña incorrecta)
- ✅ Validaciones de entrada con class-validator

## Estructura de Datos

### LoginDto
```typescript
{
  us_usuario: string;    // Nombre de usuario (único)
  us_password: string;   // Contraseña
}
```

### Respuesta de Login
```typescript
{
  usuario: {
    us_id: string;
    us_nombre: string;
    us_apellido: string;
    us_usuario: string;
    us_correo: string;
    us_eventos: Evento[];
  };
  message: string;
}
```

## Endpoints

### 1. Crear Usuario
```
POST /usuarios
Content-Type: application/json

{
  "us_nombre": "Juan",
  "us_apellido": "Pérez",
  "us_usuario": "jperez",
  "us_correo": "juan@email.com",
  "us_password": "123456"
}
```

### 2. Login
```
POST /usuarios/login
Content-Type: application/json

{
  "us_usuario": "jperez",
  "us_password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "us_id": "uuid-generado",
    "us_nombre": "Juan",
    "us_apellido": "Pérez",
    "us_usuario": "jperez",
    "us_correo": "juan@email.com",
    "us_eventos": []
  },
  "message": "Login exitoso"
}
```

**Errores posibles:**
- **404**: Usuario no encontrado
- **401**: Contraseña incorrecta
- **400**: Datos de entrada inválidos

## Validaciones

### Crear Usuario
- `us_nombre`: 2-20 caracteres
- `us_apellido`: 2-20 caracteres
- `us_usuario`: 3-20 caracteres, único
- `us_correo`: Email válido, único
- `us_password`: Mínimo 6 caracteres

### Login
- `us_usuario`: Requerido, string
- `us_password`: Requerido, string

## Seguridad

**⚠️ IMPORTANTE: Esta implementación es para fines educativos únicamente.**

Características de seguridad implementadas:
- ✅ Las contraseñas no se retornan en las respuestas
- ✅ Validación de entrada para prevenir inyecciones
- ✅ Manejo de errores sin exponer información sensible

**Características NO implementadas (no recomendadas para producción):**
- ❌ No hay hash de contraseñas
- ❌ No hay JWT o tokens de sesión
- ❌ No hay rate limiting
- ❌ No hay encriptación de datos

## Uso

### 1. Crear un usuario
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "us_nombre": "Juan",
    "us_apellido": "Pérez", 
    "us_usuario": "jperez",
    "us_correo": "juan@email.com",
    "us_password": "123456"
  }'
```

### 2. Hacer login
```bash
curl -X POST http://localhost:3000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "us_usuario": "jperez",
    "us_password": "123456"
  }'
```

## Archivos Modificados

```
src/
├── usuarios/
│   ├── dto/
│   │   ├── login.dto.ts           # DTO para login
│   │   └── create-usuario.dto.ts  # Actualizado con campo password
│   ├── entities/
│   │   └── usuario.entity.ts      # Agregado campo us_password
│   ├── usuarios.service.ts        # Método login() agregado
│   └── usuarios.controller.ts     # Endpoint POST /login agregado
```

## Notas para Producción

Para un sistema en producción, se recomendaría:

1. **Hash de contraseñas**: Usar bcrypt o similar
2. **JWT**: Implementar tokens JWT para sesiones
3. **Rate limiting**: Limitar intentos de login
4. **HTTPS**: Usar conexiones seguras
5. **Validación adicional**: Implementar CAPTCHA para prevenir bots
6. **Logs de seguridad**: Registrar intentos de login fallidos

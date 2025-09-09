# TaskListApp - API Backend

Este proyecto es el backend de una aplicación de gestión de tareas personales, con autenticación de usuarios, recuperación de contraseña y manejo seguro de datos.

---

## ✨ Funcionalidades principales

### 1. Autenticación y gestión de usuarios

- **Registro y login de usuarios**
  - Los usuarios pueden autenticarse con email y contraseña.
  - El login retorna un token JWT necesario para acceder a rutas protegidas.
  - Las rutas protegidas requieren el header:  
    `Authorization: Bearer <token>`

- **Bloqueo temporal por intentos fallidos**
  - Si un usuario falla varias veces el login, su cuenta puede ser bloqueada temporalmente.

---

### 2. Recuperación y restablecimiento de contraseña

- **Solicitud de recuperación**
  - Endpoint: `POST /api/v1/auth/forgot-password`
  - El usuario envía su email y, si existe, recibe un enlace de recuperación (vía Mailtrap en desarrollo).
  - El backend responde siempre con HTTP 202, sin revelar si el correo existe.

- **Restablecimiento de contraseña**
  - Endpoint: `POST /api/v1/auth/reset-password`
  - El usuario envía el token recibido, la nueva contraseña y su confirmación.
  - El backend valida el token, la fortaleza de la contraseña y la coincidencia.
  - Si es válido, actualiza la contraseña (hasheada con bcrypt) y elimina el token.

- **Validaciones y seguridad**
  - Contraseña: mínimo 8 caracteres, mayúscula, minúscula y número.
  - El token de recuperación expira en 1 hora y solo puede usarse una vez.
  - Los mensajes de error son genéricos y accesibles.

---

### 3. Gestión de tareas personales

- **Obtener tareas del usuario autenticado**
  - Endpoint: `GET /api/v1/tasks`
  - Devuelve solo las tareas asociadas al usuario autenticado, ordenadas por fecha de creación ascendente.

- **Crear una nueva tarea**
  - Endpoint: `POST /api/v1/tasks/new`
  - Crea una tarea asociada al usuario autenticado.
  - Campos requeridos: `title`, `description`.
  - Campo opcional: `status` (`Por hacer`, `Haciendo`, `Hecho`).

- **(Opcional) Actualizar y eliminar tareas**
  - Endpoints: `PUT /api/v1/tasks/:id`, `DELETE /api/v1/tasks/:id`
  - Solo el usuario dueño puede modificar o eliminar sus tareas.

---

## 📡 Endpoints involucrados

### Autenticación y recuperación
- `POST /api/v1/auth/login`
  - Body:
    ```json
    { "email": "usuario@correo.com", "password": "TuClave123" }
    ```
- `POST /api/v1/auth/forgot-password`
  - Body:
    ```json
    { "email": "usuario@correo.com" }
    ```
- `POST /api/v1/auth/reset-password`
  - Body:
    ```json
    { "token": "EL_TOKEN_GENERADO", "password": "NuevaContraseña123", "confirmPassword": "NuevaContraseña123" }
    ```

### Tareas (requieren JWT)
- `GET /api/v1/tasks`
- `POST /api/v1/tasks/new`
  - Body:
    ```json
    { "title": "Mi tarea", "description": "Descripción", "status": "Por hacer" }
    ```

---

## 🛡️ Seguridad y manejo de errores

- **JWT:** Todas las rutas de tareas requieren autenticación.
- **Errores claros:**  
  - Mensajes de error accesibles y sin revelar información sensible.
  - Errores de autenticación retornan `401` o `423` según el caso.
  - Errores internos retornan mensajes genéricos y loguean detalles en desarrollo.
- **Validaciones:**  
  - Contraseñas fuertes y confirmación obligatoria.
  - Solo el usuario dueño puede ver o crear sus tareas.

---

## 🧪 Ejemplo de uso con curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@correo.com","password":"TuClave123"}'
```

**Solicitud de recuperación:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@correo.com"}'
```

**Restablecimiento de contraseña:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"EL_TOKEN_GENERADO","password":"NuevaContraseña123","confirmPassword":"NuevaContraseña123"}'
```

**Obtener tareas:**
```bash
curl -X GET http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

**Crear tarea:**
```bash
curl -X POST http://localhost:3000/api/v1/tasks/new \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","description":"Descripción de la tarea"}'
```

---

## 💡 Notas

- El backend está preparado para integrarse con un frontend tipo Kanban o lista.
- El envío de correos de recuperación usa Mailtrap en desarrollo.
- El sistema es extensible para agregar más funcionalidades CRUD sobre tareas.
- Los mensajes de error están diseñados para ser accesibles y no
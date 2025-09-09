# Recuperación de Contraseña

Este proyecto implementa un flujo seguro de recuperación y restablecimiento de contraseña para usuarios registrados.

---

## 🛠️ Flujo de recuperación

### 1. Solicitud de recuperación

- El usuario accede a `/forgot-password` y envía su correo electrónico.
- El backend responde siempre con **HTTP 202 (Accepted)**, sin indicar si el correo existe.
- Si el correo está registrado, se genera un token seguro de un solo uso, válido por 1 hora, y se envía un correo con un enlace de restablecimiento.

### 2. Recepción del enlace

- El usuario recibe un correo (usando **Mailtrap** en desarrollo) con un enlace similar a:

https://<FRONTEND_URL>/reset?token=EL_TOKEN_GENERADO

- El enlace contiene el token de recuperación.

### 3. Restablecimiento de contraseña

- El usuario accede al enlace y es dirigido a un formulario donde debe ingresar una nueva contraseña y confirmarla.
- El frontend envía una petición **POST** a `/reset-password` con el token, la nueva contraseña y la confirmación.

### 4. Validaciones

El backend verifica:
- Que el token sea válido y no haya expirado.
- Que la contraseña cumpla con los requisitos de seguridad (mínimo 8 caracteres, mayúscula, minúscula y número).
- Que la confirmación coincida.

Si todo es correcto:
- Se actualiza la contraseña (hasheada con bcrypt).
- El token se invalida inmediatamente.
- Se responde con **HTTP 200** y mensaje de éxito.

Si el token es inválido o expiró, se responde con un mensaje de error.

### 5. Manejo de errores

- Si el correo no está registrado, la respuesta es siempre **202 (Accepted)** para no filtrar cuentas.
- Errores internos retornan un mensaje genérico: `"Inténtalo de nuevo más tarde"`.

---

## 📡 Endpoints involucrados

- `POST /api/v1/auth/forgot-password`
- **Body:**  
  ```json
  { "email": "usuario@correo.com" }
  ```
- `POST /api/v1/auth/reset-password`
- **Body:**  
  ```json
  { "token": "EL_TOKEN_GENERADO", "password": "NuevaContraseña123", "confirmPassword": "NuevaContraseña123" }
  ```

---

## 💡 Notas

- El correo de recuperación se envía usando **Mailtrap** en desarrollo.
- El enlace de recuperación solo puede usarse una vez y expira en 1 hora.
- Los mensajes de error están diseñados para ser accesibles y no revelar información sensible.

---

## 🧪 Ejemplo de petición con curl

**Solicitud de recuperación:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
-H "Content-Type: application/json" \
-d '{"email":"usuario@correo.com"}'

Restablecimiento de contraseña:

curl -X POST http://localhost:3000/api/v1/auth/reset-password 
-H "Content-Type: application/json"
-d '{"token":"EL_TOKEN_GENERADO","password":"NuevaContraseña123","confirmPassword":"NuevaContraseña123"}'
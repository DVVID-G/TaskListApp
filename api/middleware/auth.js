const jwt = require("jsonwebtoken");

/**
 * Middleware de autenticación JWT para rutas protegidas.
 * Verifica el token enviado en el header Authorization y agrega el usuario decodificado a req.user.
 * Si el token es inválido o no existe, responde con 401.
 *
 * @function
 * @param {import('express').Request} req - Objeto de solicitud Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * @returns {void}
 */

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Inicia sesión de nuevo" });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Inicia sesión de nuevo" });
  }
};
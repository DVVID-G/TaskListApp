const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetEmail = require("../utils/sendResetEmail");

/**
 * Controlador para la autenticación y recuperación de contraseña de usuarios.
 * Incluye login, solicitud de recuperación y restablecimiento de contraseña.
 * @namespace AuthController
 */
const AuthController = {
    /**
   * Inicia sesión de usuario.
   * Verifica credenciales, bloquea por intentos fallidos y retorna un token JWT si es exitoso.
   * @async
   * @function
   * @param {import('express').Request} req - Objeto de solicitud Express (debe tener email y password en el body).
   * @param {import('express').Response} res - Objeto de respuesta Express.
   * @returns {Promise<void>}
   * 
   * @example
   * // Body:
   * // { "email": "usuario@correo.com", "password": "TuClave123" }
   */
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserDAO.model.findOne({ email });
      // Log para depuración
      if (process.env.NODE_ENV === 'development') {
        console.log("Hash guardado en BD:", user && user.password);
        console.log("Clave ingresada:", password);
      }
      if (!user || !user.password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      if (user.bloqueada) {
        return res.status(423).json({ message: "Cuenta temporalmente bloqueada" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        await UserDAO.model.updateOne({ _id: user._id }, { $inc: { intentosFallidos: 1 } });
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      await UserDAO.model.updateOne({ _id: user._id }, { $set: { intentosFallidos: 0 } });
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.json({
        token,
        user: {
          id: user._id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
  },
  /**
   * Solicita recuperación de contraseña.
   * Envía un enlace de recuperación al correo si el usuario existe.
   * Siempre responde con éxito para no revelar si el correo existe.
   * @async
   * @function
   * @param {import('express').Request} req - Objeto de solicitud Express (debe tener email en el body).
   * @param {import('express').Response} res - Objeto de respuesta Express.
   * @returns {Promise<void>}
   * 
   * @example
   * // Body:
   * // { "email": "usuario@correo.com" }
   */
  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await UserDAO.model.findOne({ email });
      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hora
        await user.save();
        await sendResetEmail(user.email, token);
      }
      res.status(202).json({ message: "Si el correo existe, se enviará un enlace para restablecer la contraseña." });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(error);
      res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
  },
  /**
   * Restablece la contraseña usando un token de recuperación.
   * Valida el token, la fortaleza y coincidencia de la contraseña, y actualiza la contraseña del usuario.
   * @async
   * @function
   * @param {import('express').Request} req - Objeto de solicitud Express (debe tener token, password y confirmPassword en el body).
   * @param {import('express').Response} res - Objeto de respuesta Express.
   * @returns {Promise<void>}
   * 
   * @example
   * // Body:
   * // { "token": "TOKEN_RECIBIDO", "password": "NuevaClave123", "confirmPassword": "NuevaClave123" }
   */
  async resetPassword(req, res) {
    const { token, password, confirmPassword } = req.body;
    try {
      const user = await UserDAO.model.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() }
      });
      if (!user) {
        return res.status(400).json({ message: "Enlace inválido o caducado" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula y número" });
      }
      user.password = password;
      user.confirmPassword = confirmPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
      res.status(200).json({ message: "Contraseña actualizada" });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(error);
      res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
  }
};

module.exports = AuthController;
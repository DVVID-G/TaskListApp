const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetEmail = require("../utils/sendResetEmail");

const AuthController = {
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
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
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
   * Restablece la contraseña usando un token.
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
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
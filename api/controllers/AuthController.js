// api/controllers/AuthController.js
const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthController = {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      // Buscar usuario por email usando el DAO
      const user = await UserDAO.model.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      if (user.bloqueada) {
        return res.status(423).json({ message: "Cuenta temporalmente bloqueada" });
      }
      // Comparar contraseña
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        // Aquí puedes incrementar el contador de intentos fallidos usando el DAO
        await UserDAO.model.updateOne({ _id: user._id }, { $inc: { intentosFallidos: 1 } });
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      // Si login exitoso, reinicia el contador de intentos
      await UserDAO.model.updateOne({ _id: user._id }, { $set: { intentosFallidos: 0 } });
      // Generar JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      // Retornar token y datos públicos
      res.json({
        token,
        user: {
          id: user._id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        }
      });
    } 
    catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      res.status(500).json({ message: "Inténtalo de nuevo más tarde" });
    }
  }
};

module.exports = AuthController;
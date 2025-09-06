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
      // Comparar contraseña
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      // Generar JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
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
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
};

module.exports = AuthController;
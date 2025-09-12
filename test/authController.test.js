// test/authController.test.js
const AuthController = require("../api/controllers/AuthController");
const UserDAO = require("../api/dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetEmail = require("../api/utils/sendResetEmail");

jest.mock("../api/dao/UserDAO", () => ({
  model: {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({
    toString: () => "mockedToken",
  })),
}));

jest.mock("../api/utils/sendResetEmail");

describe("AuthController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("debería autenticar y devolver token si credenciales son correctas", async () => {
      const mockUser = {
        _id: "123",
        email: "test@test.com",
        password: "hashedPassword",
        intentosFallidos: 0,
      };
      req.body = { email: "test@test.com", password: "password123" };

      UserDAO.model.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeJwtToken");

      await AuthController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "fakeJwtToken",
        user: {
          id: "123",
          nombres: undefined,
          apellidos: undefined,
          email: "test@test.com",
        },
      });
    });

    it("debería responder 401 si credenciales son inválidas", async () => {
      req.body = { email: "test@test.com", password: "wrong" };
      UserDAO.model.findOne.mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Credenciales inválidas",
      });
    });
  });

  describe("forgotPassword", () => {
    it("debería generar token y llamar sendResetEmail si el usuario existe", async () => {
      const mockUser = {
        email: "test@test.com",
        save: jest.fn(),
      };
      UserDAO.model.findOne.mockResolvedValue(mockUser);

      req.body = { email: "test@test.com" };

      await AuthController.forgotPassword(req, res);

      expect(sendResetEmail).toHaveBeenCalledWith(
        "test@test.com",
        "mockedToken"
      );
      expect(res.status).toHaveBeenCalledWith(202);
    });
  });

  describe("resetPassword", () => {
    it("debería actualizar contraseña si token es válido", async () => {
      const mockUser = {
        password: "",
        confirmPassword: "",
        resetToken: "mockedToken",
        resetTokenExpires: Date.now() + 10000,
        save: jest.fn(),
      };

      UserDAO.model.findOne.mockResolvedValue(mockUser);

      req.body = {
        token: "mockedToken",
        password: "NuevaClave123",
        confirmPassword: "NuevaClave123",
      };

      await AuthController.resetPassword(req, res);

      expect(mockUser.password).toBe("NuevaClave123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña actualizada",
      });
    });

    it("debería responder 400 si contraseñas no coinciden", async () => {
      UserDAO.model.findOne.mockResolvedValue({
        resetTokenExpires: Date.now() + 10000,
      });

      req.body = {
        token: "mockedToken",
        password: "123",
        confirmPassword: "456",
      };

      await AuthController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Las contraseñas no coinciden",
      });
    });
  });
});

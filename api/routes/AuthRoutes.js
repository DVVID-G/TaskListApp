const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

/**
 * @fileoverview Rutas de autenticación y recuperación de contraseña.
 * Define los endpoints para login, solicitud y restablecimiento de contraseña.
 * @module routes/AuthRoutes
 */

/**
 * Inicia sesión de usuario.
 * @route POST /api/v1/auth/login
 * @group Autenticación
 * @param {string} email.body.required - Email del usuario
 * @param {string} password.body.required - Contraseña del usuario
 * @returns {object} 200 - Token JWT y datos del usuario
 */
router.post("/login", (req, res) => AuthController.login(req, res));
/**
 * Solicita recuperación de contraseña.
 * @route POST /api/v1/auth/forgot-password
 * @group Autenticación
 * @param {string} email.body.required - Email del usuario
 * @returns {object} 202 - Mensaje de confirmación
 */
router.post('/forgot-password', (req, res) => AuthController.forgotPassword(req, res));
/**
 * Restablece la contraseña usando un token de recuperación.
 * @route POST /api/v1/auth/reset-password
 * @group Autenticación
 * @param {string} token.body.required - Token de recuperación
 * @param {string} password.body.required - Nueva contraseña
 * @param {string} confirmPassword.body.required - Confirmación de la nueva contraseña
 * @returns {object} 200 - Mensaje de éxito
 */
router.post('/reset-password', (req, res) => AuthController.resetPassword(req, res));

module.exports = router;
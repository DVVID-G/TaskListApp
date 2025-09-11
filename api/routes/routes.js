const express = require("express");
const userRoutes = require("./userRoutes");

const router = express.Router();

/**
 * Mount user-related routes.
 *
 * All routes defined in {@link userRoutes} will be accessible under `/users`.
 * Example:
 *   - GET  /users        → Get all users
 *   - POST /users        → Create a new user
 *   - GET  /users/:id    → Get a user by ID
 *   - PUT  /users/:id    → Update a user by ID
 *   - DELETE /users/:id  → Delete a user by ID
 */
router.use("/users", userRoutes);

/**
 * Export the main router instance.
 * This is imported in `index.js` and mounted under `/api/v1`.
 */
module.exports = router;

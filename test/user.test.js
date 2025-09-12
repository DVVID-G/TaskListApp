const request = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");

describe("User API", () => {
  let userId;

  it("POST /api/v1/users → crea un usuario", async () => {
    const res = await request(app).post("/api/v1/users").send({
      nombres: "Jose",
      apellidos: "Montes",
      edad: 26,
      email: "jose.montes@univalle.edu.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(res.statusCode).toBe(201); //
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombres).toBe("Jose"); //
    userId = res.body._id;
  });

  it("GET /api/v1/users → obtiene lista de usuarios", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/users/:id → obtiene un usuario por ID", async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", userId);
  });

  it("PUT /api/v1/users/:id → actualiza un usuario", async () => {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ nombres: "Pedro" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombres).toBe("Pedro");
  });

  it("DELETE /api/v1/users/:id → elimina un usuario", async () => {
    const res = await request(app).delete(`/api/v1/users/${userId}`);
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

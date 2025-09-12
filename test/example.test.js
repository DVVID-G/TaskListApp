const request = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");

describe("Healthcheck", () => {
  it("GET / debería responder 'Welcome to the API server! Tasklistapp is running.'", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Welcome to the API server! Tasklistapp is running.");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

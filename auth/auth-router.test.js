const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("auth-router", () => {
  describe("POST /register", () => {
    beforeEach(async () => {
      await db.migrate.rollback().then(() => db.migrate.latest());
    });
    it("returns status 400 if info is invalid", async () => {
      await supertest(server)
        .post("/api/auth/register")
        .send({})
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });
    it("returns status 201 if created successfully", async () => {
      await supertest(server)
        .post("/api/auth/register")
        .send({ username: "Senorski", password: "poiuy999" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
  });
  describe("POST /login", () => {
    it("returns status 200 if info is valid", async () => {
      await supertest(server)
        .post("/api/auth/login")
        .send({ username: "Senorski", password: "poiuy999" })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
    it("returns status 400 if info is invalid", async () => {
      await supertest(server)
        .post("/api/auth/login")
        .send({})
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });
  });
});

describe("jokes-router", () => {
  describe("GET /", () => {
    it("should return status 401", async () => {
      await supertest(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });
    it("should return JSON", async () => {
      await supertest(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.type).toMatch(/json/i);
        });
    });
  });
});

const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");
const Users = require("./auth-helpers");

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
        .send({ username: "Sam", password: "poiuy999" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
  });
  describe("POST /login", () => {
    it("returns status 200 if info is valid", async () => {
      await supertest(server)
        .post("/api/auth/login")
        .send({ username: "Sam", password: "poiuy999" })
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
    it("returns token property with JWT value", async () => {
      await supertest(server)
        .post("/api/auth/login")
        .send({ username: "Sam", password: "poiuy999" })
        .then((res) => {
          expect(res.body.token).toContain(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
          );
        });
    });
  });
});
describe("validate method", () => {
  it("returns true if it has both username and password", () => {
    const newUser = {
      username: "Alex",
      password: "123",
    };
    expect(Users.validate(newUser)).toBeTruthy();
  });
  it("returns false if it is missing info", () => {
    const newUser = {
      username: "Nate",
    };
    expect(Users.validate(newUser)).toBeFalsy();
  });
});

const supertest = require("supertest");
const server = require("../api/server");

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

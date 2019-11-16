import app from "../../app";
import User from "../../models/User";
import request from "supertest";

describe("Authentication", () => {
  beforeEach(done => {
    // Remove all records before each test
    User.deleteMany({}, () => done());
  });

  describe("POST /auth/signup", () => {
    it("should register a new user", done => {
      const user = {
        name: "Jest",
        email: "jest@gmail.com",
        password: "jest1234"
      };
      request(app)
        .post("/auth/signup")
        .send(user)
        .end((err: any, res: any) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toHaveProperty("message");
          done();
        });
    });
    it("should handle incomplete requests", done => {
      const user = {
        email: "jest@gmail.com",
        password: "jest1234"
      };
      request(app)
        .post("/auth/signup")
        .send(user)
        .end((err: any, res: any) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("error");
          expect(res.body.error).toHaveProperty("type", "InvalidBody");
          done();
        });
    });
    it("should return a 409 error if a duplicate email exists", done => {
      const user = {
        name: "jest",
        email: "jest@gmail.com",
        password: "jest1234"
      };
      request(app)
        .post("/auth/signup")
        .send(user)
        .end(() => {
          request(app)
            .post("/auth/signup")
            .send(user)
            .end((err: any, res: any) => {
              expect(res.statusCode).toBe(409);
              expect(res.body).toHaveProperty("error");
              expect(res.body.error).toHaveProperty("type", "DuplicateEmail");
              done();
            });
        });
    });
  });

  // describe("POST /auth/login")
});

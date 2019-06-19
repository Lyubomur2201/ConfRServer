const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

const server = require("../../src/api/app");
const sequelize = require("../../src/api/database");

chai.use(chaiHttp);

describe("Auth route", () => {
  let token;
  const signup = "/auth/signup";
  const signin = "/auth/signin";
  const username = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  after(() => {
    sequelize.truncate({ cascade: true });
  });

  describe("SignUp", () => {
    it("Should create new user if email and username not used", done => {
      chai
        .request(server)
        .post(signup)
        .send({ email, password, username })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("token");
          token = res.body.token;
          done();
        });
    });

    it("Should return status 400 if username already in use", done => {
      chai
        .request(server)
        .post(signup)
        .send({ username, email: faker.internet.email(), password })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it("Should return status 400 if email already in use", done => {
      chai
        .request(server)
        .post(signup)
        .send({ username: faker.internet.userName(), email, password })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("SignIn", () => {
    it("Should return JWT token if username and password correct", done => {
      chai
        .request(server)
        .post(signin)
        .send({ username, password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("token");
          expect(res.body.token).to.equal(token);
          done();
        });
    });

    it("Should return status 401 if username incorrect", done => {
      chai
        .request(server)
        .post(signin)
        .send({ username: faker.internet.userName(), password })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it("Should return status 401 if password incorrect", done => {
      chai
        .request(server)
        .post(signin)
        .send({ username, password: faker.internet.password() })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});

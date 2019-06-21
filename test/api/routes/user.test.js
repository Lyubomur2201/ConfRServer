const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

const server = require("../../../src/api/app");
const sequelize = require("../../../src/api/database");

chai.use(chaiHttp);

describe("User route", () => {
  let token;
  const signup = "/auth/signup";
  const me = "/user/me";

  const username = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  before(done => {
    chai
      .request(server)
      .post(signup)
      .send({ username, email, password })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  after(done => {
    sequelize.truncate({ cascade: true }).then(() => {
      done();
    });
  });

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  describe("Me", () => {
    it("Should return my user and status 200 when jwt token provided", done => {
      chai
        .request(server)
        .get(me)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("id");
          expect(res.body).to.have.property("username");
          expect(res.body).to.have.property("email");
          expect(res.body).to.have.property("topics");
          expect(res.body.topics).to.be.empty;
          done();
        });
    });

    it("Should return status 401 if invalid token provided", done => {
      chai
        .request(server)
        .get(me)
        .set("Authorization", "Bearer FakeToken")
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          done();
        });
    });

    it("Should return status 401 if invalid header provided", done => {
      chai
        .request(server)
        .get(me)
        .set("Authorization", "BadToken")
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          done();
        });
    });

    it("Should return status 401 if header not set", done => {
      chai
        .request(server)
        .get(me)
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          done();
        });
    });
  });

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  describe("Get User", () => {
    it("Should return user and status 200 when user with provided username exist", done => {
      chai
        .request(server)
        .get(`/user/${username}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("id");
          expect(res.body).to.have.property("username");
          done();
        });
    });

    it("Should return status 400 when user with provided username not exist", done => {
      chai
        .request(server)
        .get(`/user/${faker.internet.userName()}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.be.equal("User not found");
          done();
        });
    });
  });
});

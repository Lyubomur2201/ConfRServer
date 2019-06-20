const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

const server = require("../../src/api/app");
const sequelize = require("../../src/api/database");

chai.use(chaiHttp);

describe("Question route", () => {
  let token, token2;
  const signup = "/auth/signup";

  const topicBody = faker.lorem.sentence();
  const inviteCode = faker.random.word();

  const question = faker.lorem.sentence();

  let questionID;
  let questionRoute;

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  before(done => {
    chai
      .request(server)
      .post(signup)
      .send({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        token = res.body.token;

        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .post(signup)
      .send({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        token2 = res.body.token;
        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .post("/topic")
      .set("Authorization", `Bearer ${token}`)
      .send({ body: topicBody, inviteCode })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Topic successfully created");
        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .post("/topic/join")
      .set("Authorization", `Bearer ${token2}`)
      .send({ inviteCode })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("You joined the topic");
        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .post(`/topic/${inviteCode}/question`)
      .set("Authorization", `Bearer ${token}`)
      .send({ question })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  before(done => {
    chai
      .request(server)
      .get(`/topic/${inviteCode}/question`)
      .end((err, res) => {
        questionID = res.body[0].id;
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

  describe("Get question", () => {
    before(done => {
      questionRoute = `/question/${questionID}`;
      done();
    });

    it("Should return status 200 and question", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("id");
          expect(res.body.id).to.equal(questionID);
          done();
        });
    });

    it("Should return status 400 when invalid question id provided", done => {
      chai
        .request(server)
        .get("/question/fakeID")
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Should return status 404 when question with provided id not exist", done => {
      chai
        .request(server)
        .get("/question/-1")
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
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

  describe("Question upvote", () => {
    it("Should have 0 upvotes", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("upvotes");
          expect(res.body.upvotes).to.be.lengthOf(0);
          done();
        });
    });

    it("Should upvote question and return status 200", done => {
      chai
        .request(server)
        .put(questionRoute)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Question upvoted");
          done();
        });
    });

    it("Now should have 1 upvote", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("upvotes");
          expect(res.body.upvotes).to.be.lengthOf(1);
          done();
        });
    });

    it("Should unvote question and return status 200", done => {
      chai
        .request(server)
        .put(questionRoute)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Question unvoted");
          done();
        });
    });

    it("Now should again have 0 upvotes", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("upvotes");
          expect(res.body.upvotes).to.be.lengthOf(0);
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

  describe("Delete question", () => {
    it("Should return 400 if user not topic creator", done => {
      chai
        .request(server)
        .delete(questionRoute)
        .set("Authorization", `Bearer ${token2}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("You cant edit this topic");
          done();
        });
    });

    it("Should return 200 if user is topic creator", done => {
      chai
        .request(server)
        .delete(questionRoute)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Question successfuly deleted");
          done();
        });
    });
  });
});

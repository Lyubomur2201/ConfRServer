const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

const server = require("../../src/api/app");
const sequelize = require("../../src/api/database");

chai.use(chaiHttp);

describe("Topic route", () => {
  let token, token2;

  const signup = "/auth/signup";
  const topic = "/topic";
  const join = "/topic/join";

  const topicBody = faker.lorem.sentence();
  const inviteCode = faker.random.word();

  const question = faker.lorem.sentence();

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

  describe("Create", () => {
    it("Should create topic and return status 201 when body and invite code provided", done => {
      chai
        .request(server)
        .post(topic)
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

    it("Should should return status 400 if invite code already in use", done => {
      chai
        .request(server)
        .post(topic)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: topicBody, inviteCode })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            `Topic ${inviteCode} already exists`
          );
          done();
        });
    });

    it("Should return status 400 if topic body not provided", done => {
      chai
        .request(server)
        .post(topic)
        .set("Authorization", `Bearer ${token}`)
        .send({ inviteCode })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          done();
        });
    });

    it("Should return status 400 if invite code not provided", done => {
      chai
        .request(server)
        .post(topic)
        .set("Authorization", `Bearer ${token}`)
        .send({ body: topicBody })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          done();
        });
    });

    it("Should return status 400 if data not provided", done => {
      chai
        .request(server)
        .post(topic)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          done();
        });
    });

    it("Should return status 401 if user is not authorized", done => {
      chai
        .request(server)
        .post(topic)
        .send({ body: faker.lorem.sentence(), inviteCode: faker.random.word() })
        .end((err, res) => {
          expect(res.status).to.equal(401);
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

  describe("Get topic", () => {
    it("Should return 200 when valid invite code provided", done => {
      chai
        .request(server)
        .get(`/topic/${inviteCode}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("inviteCode");
          expect(res.body.inviteCode).to.equal(inviteCode);
          done();
        });
    });

    it("Should return 404 when invalid invite code provided", done => {
      chai
        .request(server)
        .get("/topic/fakeCode")
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

  describe("Join topic", () => {
    it("Should return status 400 if invite code provided, and user is topic member", done => {
      chai
        .request(server)
        .post(join)
        .set("Authorization", `Bearer ${token}`)
        .send({ inviteCode })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("You already joined this topic");
          done();
        });
    });

    it("Should return status 200 if invite code provided, and user is not topic member", done => {
      chai
        .request(server)
        .post(join)
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
  });

  it("Should return status 404 when invalid invite code provided", done => {
    chai
      .request(server)
      .post(join)
      .set("Authorization", `Bearer ${token}`)
      .send({ inviteCode: "FakeCode" })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Topic not found");
        done();
      });
  });

  it("Should return status 400 when invite code not provided", done => {
    chai
      .request(server)
      .post(join)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        done();
      });
  });

  it("Should return status 400 when invite code not provided", done => {
    chai
      .request(server)
      .post(join)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        done();
      });
  });

  it("Should return status 400 when invite code not provided", done => {
    chai
      .request(server)
      .post(join)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        done();
      });
  });

  it("Should return status 401 if user is not authorized", done => {
    chai
      .request(server)
      .post(join)
      .send({ inviteCode })
      .end((err, res) => {
        expect(res.status).to.equal(401);
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

  describe("Question", () => {
    let questionRoute;

    before(done => {
      questionRoute = `/topic/${inviteCode}/question`;
      done();
    });

    it("Fist GET should return empty array and status 200", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.empty;
          done();
        });
    });

    it("POST should return status 201 when all data provided", done => {
      chai
        .request(server)
        .post(questionRoute)
        .set("Authorization", `Bearer ${token}`)
        .send({ question })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("POST should return status 400 when data not provided", done => {
      chai
        .request(server)
        .post(questionRoute)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          done();
        });
    });

    it("Now GET should return array with 1 question and status 200", done => {
      chai
        .request(server)
        .get(questionRoute)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.lengthOf(1);
          done();
        });
    });

    it("POST should return status 404 when invalid invite code provided", done => {
      chai
        .request(server)
        .post("/topic/invalidTopic/question")
        .set("Authorization", `Bearer ${token}`)
        .send({ question })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("GET should return status 404 when invalid invite code provided", done => {
      chai
        .request(server)
        .get("/topic/invalidTopic/question")
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

  describe("Topic delete", () => {
    let delRoute;

    before(done => {
      delRoute = `/topic/${inviteCode}`;
      done();
    });

    it("Should return status 400 when user not topic creator", done => {
      chai
        .request(server)
        .delete(delRoute)
        .set("Authorization", `Bearer ${token2}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Should return status 404 when topic invalid invite code provided", done => {
      chai
        .request(server)
        .delete("/topic/fakeCode")
        .set("Authorization", `Bearer ${token2}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Should return status 401 when user not authorized", done => {
      chai
        .request(server)
        .delete(delRoute)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it("Should return status 200 when topic invalid invite code provided", done => {
      chai
        .request(server)
        .delete(delRoute)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});

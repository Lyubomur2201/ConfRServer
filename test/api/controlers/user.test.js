const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");

const User = require("../../../src/api/user/user_model");
const controler = rewire("../../../src/api/user/user_controler.js");

chai.use(sinonChai);

const sandbox = sinon.createSandbox();

describe("User controlers", () => {
  let req = {
    user: {
      id: faker.random.number(),
      username: null,
      email: null,
      Topics: []
    },
    params: {
      username: faker.internet.userName()
    },
    body: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      newPassword: faker.internet.password(),
      verificationCode: faker.random.word()
    }
  };

  let res = {
    json: function() {
      return this;
    },
    status: function() {
      return this;
    }
  };

  let user = {
    setDataValue: function() {
      return this;
    },
    save: function() {
      return this;
    }
  };

  afterEach(() => {
    sandbox.restore();
  });

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  describe("Get user", () => {
    it("Get my user should return req user and status 200", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      return controler.getMyUser(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.called;
      });
    });

    it("Get user should return status 200 and user if user in db", () => {
      let id = faker.random.number();

      sandbox.spy(res, "status");
      sandbox.spy(res, "json");
      sandbox.stub(User, "findOne").returns(Promise.resolve(req.user));

      return controler.getUser(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.called;
      });
    });

    it("Get user should return status 404 if user not in db", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));

      return controler.getUser(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.called;
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

  describe("Forgot user", () => {
    let mailgunMock = {
      messages: function() {
        return {
          send: function() {
            return this;
          }
        };
      }
    };

    let randomstringMock = {
      generate: function() {
        return "resetCode";
      }
    };

    it("Should return status 200 and send reset code to email", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      sandbox.spy(mailgunMock, "messages");
      sandbox.spy(randomstringMock, "generate");

      sandbox.spy(user, "setDataValue");
      sandbox.spy(user, "save");

      sandbox.stub(User, "findOne").returns(Promise.resolve(user));

      let mailgun = controler.__set__("mailgun", mailgunMock);

      let randomstring = controler.__set__("randomstring", randomstringMock);

      return controler.forgot(req, res).then(() => {
        expect(mailgunMock.messages).to.have.been.called;
        expect(user.setDataValue).to.have.been.calledWith(
          "resetCode",
          "resetCode"
        );
        expect(user.save).to.have.been.called;
        expect(randomstringMock.generate).to.have.been.called;

        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.called;

        mailgun();
        randomstring();
      });
    });

    it("Should return status 404 when user not in db", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      sandbox.spy(mailgunMock, "messages");
      sandbox.spy(randomstringMock, "generate");

      sandbox.spy(user, "setDataValue");
      sandbox.spy(user, "save");

      sandbox.stub(User, "findOne").returns(Promise.resolve(false));

      let mailgun = controler.__set__("mailgun", mailgunMock);

      let randomstring = controler.__set__("randomstring", randomstringMock);

      return controler.forgot(req, res).then(() => {
        expect(mailgunMock.messages).to.have.not.been.called;

        expect(user.save).to.have.not.been.called;
        expect(randomstringMock.generate).to.have.not.been.called;

        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.called;

        mailgun();
        randomstring();
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

    describe("Reset password", () => {
      it("Should return status 200 and set new password", () => {
        sandbox.spy(res, "status");
        sandbox.spy(res, "json");

        sandbox.spy(user, "setDataValue");
        sandbox.spy(user, "save");

        sandbox.stub(User, "findOne").returns(Promise.resolve(user));

        return controler.reset(req, res).then(() => {
          expect(user.setDataValue).to.have.been.called;
          expect(user.setDataValue).to.have.been.calledWith(
            "password",
            req.body.newPassword
          );
          expect(user.save).to.have.been.called;
          expect(user.save).to.have.been.calledWith({ passwordReset: true });

          expect(res.status).to.have.been.called;
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.called;
        });
      });

      it("Should return status 400 if user with same reset code not found", () => {
        sandbox.spy(res, "status");
        sandbox.spy(res, "json");

        sandbox.spy(user, "setDataValue");
        sandbox.spy(user, "save");

        sandbox.stub(User, "findOne").returns(Promise.resolve(false));

        return controler.reset(req, res).then(() => {
          expect(user.setDataValue).to.have.not.been.called;

          expect(user.save).to.have.not.been.called;

          expect(res.status).to.have.been.called;
          expect(res.status).to.have.been.calledWith(400);
          expect(res.json).to.have.been.called;
        });
      });
    });
  });
});

const dotenv = require("dotenv").config();

const chai = require("chai");
const { expect } = require("chai");
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");

const User = require("../../../src/api/user/user_model");
const controler = rewire("../../../src/api/auth/auth_controler.js");

chai.use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Auth controlers", () => {
  let req = {
    user: { id: faker.random.number },
    body: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
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

  describe("Sign up", () => {
    it("Should create user and return token with status 201", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox
        .stub(User, "create")
        .returns(Promise.resolve({ id: faker.random.number() }));
      let signToken = controler.__set__("signToken", user =>
        Promise.resolve("FakeToken")
      );

      return controler.signup(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ token: "FakeToken" });
        signToken();
      });
    });

    it("Should return status 400 if user with provided email or username exist", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");
      sandbox
        .stub(User, "findOne")
        .returns(Promise.resolve({ id: faker.random.number() }));

      return controler.signup(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(400);
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

  describe("Generate token", () => {
    it("Should return token and status 200", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      let signToken = controler.__set__("signToken", user =>
        Promise.resolve("FakeToken")
      );

      return controler.generateToken(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ token: "FakeToken" });

        signToken();
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

  describe("Verify", () => {
    let user = {
      id: faker.random.number(),
      setDataValue: function() {
        return this;
      },
      save: function() {
        return this;
      }
    };
    it("Should return token and status 200 if valid verification code provided", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      sandbox.spy(user, "setDataValue");
      sandbox.spy(user, "save");

      sandbox.stub(User, "findOne").returns(Promise.resolve(user));

      let signToken = controler.__set__("signToken", user =>
        Promise.resolve("FakeToken")
      );

      return controler.verify(req, res).then(() => {
        expect(user.setDataValue).to.have.been.calledTwice;
        expect(user.save).to.have.been.calledOnce;

        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ token: "FakeToken" });

        signToken();
      });
    });

    it("Should return 400 if invalid verification code provided", () => {
      sandbox.spy(res, "status");
      sandbox.spy(res, "json");

      sandbox.stub(User, "findOne").returns(Promise.resolve(false));

      return controler.verify(req, res).then(() => {
        expect(res.status).to.have.been.called;
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.called;
      });
    });
  });
});

const userResolver = require("./user");
const topicResolver = require("./topic");
const questionResolver = require("./question");

let rootResolver = {
  ...userResolver,
  ...topicResolver,
  ...questionResolver
};

module.exports = rootResolver;

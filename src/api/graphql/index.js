const graphqlHTTP = require("express-graphql");

const schema = require("./schema");
const resolvers = require("./resolvers");

module.exports = graphqlHTTP({
  graphiql: true,
  schema: schema,
  rootValue: resolvers
})
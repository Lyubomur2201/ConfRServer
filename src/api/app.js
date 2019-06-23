const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");

const sequelize = require("./database");
const topicRoutes = require("./topic/topic_routes");
const questionRoutes = require("./question/question_routes");
const authRoutes = require("./auth/auth_routes");
const userRoutes = require("./user/user_routes");

const Topic = require("./topic/topic_model");
const app = express();

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    if (process.env.NODE_ENV != "TEST") {
      console.log("Connection has been established successfully.");
    }
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.use(cors());
if (process.env.NODE_ENV != "TEST") {
  app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  try {
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: buildSchema(`
    type User {
      id: ID!
      username: String!
      email: String
      topics: [Topic!]
    }

    type Topic {
      id: ID!
      inviteCode: String!
      body: String!
      members: [User!]!
      creator: User!
    }

    type Question {
      id: ID!
      question: String!
      topic: Topic!
      author: User!
      upvotes: [User!]
    }

    type RootQuery {
      topic(id: ID!): Topic
    }

    type RootMutation {
      createTopic(arg: String): [String]
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      async topic(opt) {
        return await Topic.findOne({ where: { id: opt.id } });
      }
    }
  })
);
app.use("/question", questionRoutes);
app.use("/topic", topicRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

module.exports = app;

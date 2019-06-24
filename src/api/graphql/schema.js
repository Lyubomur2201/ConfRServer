const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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
      questions: [Question!]
    }

    type Question {
      id: ID!
      question: String!
      topic: Topic!
      author: User!
      upvotes: [User!]
    }

    input SignUpInput {
      username: String!
      email: String!
      password: String!
    }
    
    input SignInInput {
      username: String
      email: String
      password: String!
    }

    input TopicInput {
      inviteCode: String!
      body: String!
    }

    type AuthData {
      user: User!
      token: String!
    }

    type RootQuery {
      myUser: User!
      user(userID: ID!): User
      topic(id: ID!): Topic
      question(questionID: ID!): Question
    }

    type RootMutation {

      signup(input: SignUpInput): AuthData!
      signin(input: SignInInput): AuthData!

      
      createTopic(input: TopicInput!): Topic!
      deleteTopic(topicID: ID!): Topic!
      joinTopic(topicID: ID!): Topic!
      leaveTopic(topicID: ID!): Topic!

      askQuestion(topicID: ID!, question: String!): Question!
      deleteQuestion(questionID: ID!): Question!
      voteQuestion(questionID: ID!): Question!
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);

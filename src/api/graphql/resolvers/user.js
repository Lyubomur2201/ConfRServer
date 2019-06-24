const { getUserTopics, getUser } = require("../utils");

module.exports.myUser = async (opt, req) => {
  if (req.user == null) {
    throw Error("Unauthorized");
  }
  let { id, username, email } = req.user;

  return {
    id,
    username,
    email,
    topics: async () => getUserTopics(id)
  };
};

module.exports.user = async ({ userID }, req) => {
  return await getUser(userID);
};

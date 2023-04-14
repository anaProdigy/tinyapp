//Finding a user in the users object from its email
const findUserByEmail = function (email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
}

const generateRandomString = function() {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
};

const urlsForUser = function(id) {
  userUrls = {};
  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      userUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return userUrls;
};
module.exports = { findUserByEmail, findUserByEmail, generateRandomString} ;
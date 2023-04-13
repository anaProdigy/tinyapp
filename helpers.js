//Finding a user in the users object from its email
const findUserByEmail = function (email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
}


module.exports = findUserByEmail;
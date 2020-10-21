const fs = require('fs');
const fileName = __dirname.replace('utils', 'public/data/users.json');

const userData = (userid) => {
  const users = loadUsers();
  let message;
  if (users[userid]) {
    message = `Hi ${users[userid].name},\n` +
        `Hope all is well in ${users[userid].location}.\n` +
        `${users[userid].message}`;
  } else {
    message = `Hi Unknown User,\nWe don't have your information yet.`;
  }

  return message;
};

const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync(fileName);
    const dataJSON = dataBuffer.toString();
    console.log(dataJSON);
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = userData;

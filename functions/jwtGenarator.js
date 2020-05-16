const JWT = require("jsonwebtoken");
const Pack = require("../package");
const jwtGenerator = (data) => {
  return JWT.sign(
    {
      data: data,
      exp: Math.floor(Date.now() / 1000) + 60 * 10,
    },
    Pack.my_app.secret_key
  );
};

module.exports = {
  jwtGenerator,
};

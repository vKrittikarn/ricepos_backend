const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
const JWT = require("jsonwebtoken");
const Pack = require("../package");
const { jwtGenerator } = require("../functions/jwtGenarator");
const Crypto = require("crypto");

module.exports = (function () {
  return [
    {
      method: "POST",
      path: "/auth",
      config: {
        description: "Authenticate via username & password",
        notes: "authorize user and send token as reply",
        tags: ["api"],
        auth: false, // ignore authentication
        validate: {
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
        handler: async (req, h) => {
          const user = await Models.User.findOne({
            attributes: ["uid", "Username", "Fname", "Lname", "Role"],
            where: {
              username: req.payload.username,
              password: Crypto.createHash("md5")
                .update(req.payload.password)
                .digest("hex"),
            },
          });

          if (user == null) {
            return Boom.unauthorized("Bad credentials");
          }

          const token = jwtGenerator(user.toJSON());
          // const token = JWT.sign(
          //   {
          //     data: user.toJSON(),
          //     exp: Math.floor(Date.now() / 1000) + 60 * 2,
          //   },
          //   Pack.my_app.secret_key
          // );
          const response = h.response({
            token: token,
          });
          response.header("Authorization", token);
          return response;
        },
      },
    },
  ];
})();

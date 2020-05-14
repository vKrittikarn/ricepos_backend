"use strict";

const Hapi = require("hapi");
const HapiSwagger = require("hapi-swagger");
const Models = require("./models");
const Routes = require("./routes");
const Pack = require("./package");
const { jwtGenerator } = require("./functions/jwtGenarator");

var config = {
  port: process.env.PORT || "3000",
};

if ("production" !== process.env.NODE_ENV) {
  config.host = "localhost";
}

const server = Hapi.server(config);

async function start() {
  await server.register(require("hapi-auth-jwt2"));

  const validate = async function (decoded, request, h) {
    const { auth } = request;
    const user = await Models.User.findOne({
      attributes: ["uid", "Username", "Fname", "Lname", "Role"],
      where: {
        username: decoded.data.Username,
      },
    });

    if (user != null) {
      const token = jwtGenerator(decoded.data);
      auth.renew = true;
      auth.session = jwtGenerator(decoded.data);
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
      };
    }
  };

  server.auth.strategy("jwt", "jwt", {
    key: Pack.my_app.secret_key, // your secret key, dont share with others
    urlKey: false,
    cookieKey: false,
    verifyOptions: {
      algorithms: ["HS256"],
    },
    validate: validate,
  });

  server.ext("onPreResponse", function (request, reply) {
    const { response, auth } = request;
    if (auth.renew) {
      const headers = response.isBoom
        ? response.output.headers
        : response.headers;
      headers["Authorization"] = JSON.stringify(request.auth.session);
    }

    return reply.continue;
  });

  server.auth.default("jwt");

  for (const i in Routes) {
    server.route(Routes[i]);
  }

  await server.register({
    plugin: require("good"),
    options: {
      ops: {
        interval: 1000,
      },
      reporters: {
        myConsoleReporter: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [{ log: "*", response: "*" }],
          },
          {
            module: "good-console",
          },
          "stdout",
        ],
      },
    },
  });

  var swaggerOptions = {
    info: {
      title: "API Documentation",
      version: Pack.version,
    },
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  if ("production" === process.env.NODE_ENV) {
    swaggerOptions.host = process.env.HEROKU_APP_NAME + ".herokuapp.com";
  }

  await server.register([
    require("inert"),
    require("vision"),
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
}

Models.sequelize.sync().then(start);

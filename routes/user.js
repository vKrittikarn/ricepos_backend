const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
const Crypto = require("crypto");

module.exports = (function () {
  return [
    {
      method: "GET",
      path: "/user",
      config: {
        description: "Get all user",
        notes: "retrieve user",
        tags: ["api"],
        auth: "jwt",
        handler: async (req, h) => {
          const user = await Models.User.findAll({
            attributes: [
              "uid",
              "Username",
              "Password",
              "Role",
              "Fname",
              "Lname",
            ],
          });
          if (user == null) {
            return Boom.notFound("User not found");
          }
          return h.response(user);
        },
      },
    },
    {
      method: "GET",
      path: "/user/{id}",
      config: {
        description: "Get user by id",
        notes: "retrieve user via id",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().min(1).required(),
          },
        },
        handler: async (req, h) => {
          const user = await Models.User.findOne({
            attributes: [
              "uid",
              "Username",
              "Password",
              "Role",
              "Fname",
              "Lname",
            ],
            where: {
              uid: req.params.id,
            },
          });

          if (user == null) {
            return Boom.notFound("user not found with id: " + req.params.id);
          }

          return h.response(user);
        },
      },
    },
    {
      method: "POST",
      path: "/user",
      config: {
        description: "Insert user",
        notes: "Insert user",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
            fname: Joi.string().required(),
            lname: Joi.string().required(),
          },
        },
        handler: async (req, h) => {
          const user = await Models.User.create({
            Username: req.payload.username,
            Password: Crypto.createHash("md5")
              .update(req.payload.password)
              .digest("hex"),
            Role: req.payload.role,
            Fname: req.payload.fname,
            Lname: req.payload.lname,
          });

          if (user == null) {
            return Boom.badRequest("Cannot insert user");
          }

          return h.response("inserted " + user.uid);
        },
      },
    },
    {
      method: "DELETE",
      path: "/user/{id}",
      config: {
        description: "Delete user",
        notes: "Delete user",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().required(),
          },
        },
        handler: async (req, h) => {
          const user = await Models.User.findByPk(req.params.id);
          if (user == null) {
            return Boom.badRequest("Cannot delete user");
          }
          const index = await Models.User.destroy({
            where: {
              uid: req.params.id,
            },
          });

          return h.response(index);
        },
      },
    },
    {
      method: "PUT",
      path: "/user",
      config: {
        description: "Delete user",
        notes: "Delete user",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            id: Joi.number().integer().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
            fname: Joi.string().required(),
            lname: Joi.string().required(),
          },
        },
        handler: async (req, h) => {
          const user = await Models.user.findByPk(req.payload.id);
          let tmpPassword = "";
          if (user == null) {
            return Boom.badRequest("Cannot update user");
          }
          if (req.payload.password.length != 32) {
            tmpPassword = Crypto.createHash("md5")
              .update(req.payload.password)
              .digest("hex");
          } else {
            tmpPassword = req.payload.password;
          }
          const index = await Models.User.update(
            {
              Username: req.payload.username,
              Password: tmpPassword,
              Role: req.payload.role,
              Fname: req.payload.fname,
              Lname: req.payload.lname,
            },
            {
              where: {
                mid: req.payload.id,
              },
            }
          );
          return h.response(index);
        },
      },
    },
  ];
})();

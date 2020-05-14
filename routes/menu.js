const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");

module.exports = (function () {
  return [
    {
      method: "GET",
      path: "/menu",
      config: {
        description: "Get all menu",
        notes: "retrieve menu",
        tags: ["api"],
        auth: "jwt",
        handler: async (req, h) => {
          const menu = await Models.Menu.findAll({
            attributes: ["mid", "Menu_name", "mt_id", "Price"],
          });

          return h.response(menu);
        },
      },
    },
    {
      method: "GET",
      path: "/menu/{id}",
      config: {
        description: "Get menu by id",
        notes: "retrieve menu via id",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().min(1).required(),
          },
        },
        handler: async (req, h) => {
          const menu = await Models.Menu.findOne({
            attributes: ["mid", "Menu_name", "mt_id", "Price"],
            where: {
              mid: req.params.id,
            },
          });

          if (menu == null) {
            return Boom.notFound("menu not found with id: " + req.params.id);
          }

          return h.response(menu);
        },
      },
    },
    {
      method: "POST",
      path: "/menu",
      config: {
        description: "Insert menu",
        notes: "Insert menu",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            name: Joi.string().required(),
            type: Joi.number().integer().required(),
            price: Joi.number().required(),
          },
        },
        handler: async (req, h) => {
          const menu = await Models.Menu.create({
            Menu_name: req.payload.name,
            mt_id: req.payload.type,
            Price: req.payload.price,
          });

          if (menu.mid == "") {
            return Boom.badRequest("Cannot insert menu");
          }

          return h.response("inserted " + menu.mid);
        },
      },
    },
    {
      method: "DELETE",
      path: "/menu/{id}",
      config: {
        description: "Delete menu",
        notes: "Delete menu",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().required(),
          },
        },
        handler: async (req, h) => {
          const menu = await Models.Menu.findByPk(req.params.id);
          if (!menu) {
            return Boom.badRequest("Cannot delete menu");
          }
          const index = await Models.Menu.destroy({
            where: {
              mid: req.params.id,
            },
          });

          return h.response(index);
        },
      },
    },
    {
      method: "PUT",
      path: "/menu",
      config: {
        description: "Delete menu",
        notes: "Delete menu",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
            type: Joi.number().integer().required(),
            price: Joi.number().required(),
          },
        },
        handler: async (req, h) => {
          const menu = await Models.Menu.findByPk(req.payload.id);
          if (!menu) {
            return Boom.badRequest("Cannot update menu");
          }
          const index = await Models.Menu.update(
            {
              Menu_name: req.payload.name,
              mt_id: req.payload.type,
              Price: req.payload.price,
            },
            {
              where: {
                mid: req.payload.id,
              },
            }
          );
          console.log("test");
          return h.response(index);
        },
      },
    },
  ];
})();

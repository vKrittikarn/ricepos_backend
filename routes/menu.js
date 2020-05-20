const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
const { uploadHandler } = require("../functions/uploadHandler");
const path = "/upload/menu/";

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
            attributes: ["mid", "Menu_name", "mt_id", "Price", "image"],
          });

          if (menu == null) {
            return Boom.notFound("Menu not found");
          }

          const tmpMenu = menu.map((e) => {
            console.log(e.image);
            e.image == null
              ? (e.image = path + "default.jpg")
              : (e.image = path + e.image);
            return e;
          });

          return h.response(tmpMenu);
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
            attributes: ["mid", "Menu_name", "mt_id", "Price", "image"],
            where: {
              mid: req.params.id,
            },
          });

          if (menu == null) {
            return Boom.notFound("menu not found with id: " + req.params.id);
          }

          const tmpMenu = menu;
          tmpMenu.image == null
            ? (tmpMenu.image = path + "default.jpg")
            : (tmpMenu.image = path + tmpMenu.image);

          return h.response(tmpMenu);
        },
      },
    },
    {
      method: "GET",
      path: "/upload/menu/{file*}",
      config: {
        description: "Get image of menu by filename",
        notes: "retrieve image of menu",
        tags: ["api"],
        auth: false,
        handler: {
          directory: {
            path: "upload/menu/",
          },
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
        payload: {
          maxBytes: 20715200,
          output: "stream",
          parse: true,
          allow: "multipart/form-data",
        },
        validate: {
          payload: {
            name: Joi.string().required(),
            type: Joi.number().integer().required(),
            price: Joi.number().required(),
            file: Joi.any()
              .meta({ swaggerType: "file" })
              .optional()
              .allow("")
              .description("image file"),
          },
        },
        handler: async (req, h) => {
          const tmpUpload = await uploadHandler(req.payload.file);
          console.log(tmpUpload);
          const menu = await Models.Menu.create({
            Menu_name: req.payload.name,
            mt_id: req.payload.type,
            Price: req.payload.price,
            image: tmpUpload.filename,
          });

          if (menu == null) {
            return Boom.badRequest("Cannot insert menu");
          }

          return h.response(menu.mid);
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
          if (menu == null) {
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
          if (menu == null) {
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
          return h.response(index);
        },
      },
    },
  ];
})();

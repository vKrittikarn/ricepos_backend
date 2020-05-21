const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");

module.exports = (function () {
  return [
    {
      method: "GET",
      path: "/order_type",
      config: {
        description: "Get all type of order",
        notes: "retrieve type of order",
        tags: ["api"],
        auth: "jwt",
        handler: async (req, h) => {
          const order_type = await Models.Order_type.findAll({
            attributes: ["order_type_id", "order_type_name"],
          });

          if (order_type == null) {
            return Boom.notFound("Type of order not found");
          }

          return h.response(order_type);
        },
      },
    },
    {
      method: "GET",
      path: "/order_type/{id}",
      config: {
        description: "Get type of order by id",
        notes: "retrieve type of order via id",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().min(1).required(),
          },
        },
        handler: async (req, h) => {
          const order_type = await Models.Order_type.findOne({
            attributes: ["order_type_id", "order_type_name"],
            where: {
              order_type_id: req.params.id,
            },
          });

          if (order_type == null) {
            return Boom.notFound(
              "Type of order not found with id: " + req.params.id
            );
          }

          return h.response(order_type);
        },
      },
    },
    {
      method: "POST",
      path: "/order_type",
      config: {
        description: "Insert type of order",
        notes: "Insert type of order",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            name: Joi.string().required(),
          },
        },
        handler: async (req, h) => {
          const order_type = await Models.Order_type.create({
            order_type_name: req.payload.name,
          });

          if (order_type == null) {
            return Boom.badRequest("Cannot insert type of order");
          }

          return h.response("inserted " + order_type.order_type_id);
        },
      },
    },
    {
      method: "DELETE",
      path: "/order_type/{id}",
      config: {
        description: "Delete type of order",
        notes: "Delete type of order",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().required(),
          },
        },
        handler: async (req, h) => {
          const order_type = await Models.Order_type.findByPk(req.params.id);
          if (order_type == null) {
            return Boom.badRequest("Cannot delete type of order");
          }
          const index = await Models.Order_type.destroy({
            where: {
              order_type_id: req.params.id,
            },
          });

          return h.response(index);
        },
      },
    },
    {
      method: "PUT",
      path: "/order_type",
      config: {
        description: "Update type of order",
        notes: "Update type of order",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
          },
        },
        handler: async (req, h) => {
          const order_type = await Models.Order_type.findByPk(req.payload.id);
          if (order_type == null) {
            return Boom.badRequest("Cannot update type of order");
          }
          const index = await Models.Order_type.update(
            {
              order_type_name: req.payload.name,
            },
            {
              where: {
                order_type_id: req.payload.id,
              },
            }
          );
          return h.response(order_type.order_type_id);
        },
      },
    },
  ];
})();

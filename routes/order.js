const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
module.exports = (function () {
  return [
    {
      method: "GET",
      path: "/order",
      config: {
        description: "Get all order",
        notes: "retrieve order",
        tags: ["api"],
        auth: "jwt",
        handler: async (req, h) => {
          const Order = await Models.Order.findAll({
            include: [
              {
                model: Models.User,
              },
              {
                model: Models.Order_type,
              },
              {
                model: Models.Order_detail,
                include: [
                  {
                    model: Models.Menu,
                  },
                  {
                    model: Models.Addons,
                    include: [
                      {
                        model: Models.Menu,
                      },
                    ],
                  },
                ],
              },
            ],
          });
          const resObj = await Order.map((Order) => {
            //tidy up the user data
            console.log(Order);
            return Object.assign(
              {},
              {
                order_id: Order.order_id,
                order_date: Order.order_date,
                total_price: Order.Total_price,
                change: Order.Change,
                order_type: Order.order_type_id,
                user: Order.User.Fname + " " + Order.User.Lname,
                order_detail: Order.Order_details.map((Order_detail) => {
                  //tidy up the post data
                  return Object.assign(
                    {},
                    {
                      order_detail_id: Order_detail.order_detail_id,
                      amount: Order_detail.amount,
                      sub_total_price: Order_detail.sub_total_price,
                      menu_name: Order_detail.Menu.Menu_name,
                      addons: Order_detail.Addons.map((Addons) => {
                        return Object.assign(
                          {},
                          {
                            addon_id: Addons.addon_id,
                            price: Addons.price,
                            name: Addons.Menu.Menu_name,
                          }
                        );
                      }),
                    }
                  );
                }),
              }
            );
          });
          return h.response(resObj);
        },
      },
    },
    {
      method: "GET",
      path: "/order/{id}",
      config: {
        description: "Get all order",
        notes: "retrieve order",
        tags: ["api"],
        auth: "jwt",
        validate: {
          params: {
            id: Joi.number().integer().min(1).required(),
          },
        },
        handler: async (req, h) => {
          const Order = await Models.Order.findAll({
            include: [
              {
                model: Models.User,
              },
              {
                model: Models.Order_type,
              },
              {
                model: Models.Order_detail,
                include: [
                  {
                    model: Models.Menu,
                  },
                  {
                    model: Models.Addons,
                    include: [
                      {
                        model: Models.Menu,
                      },
                    ],
                  },
                ],
              },
            ],
            where: {
              order_id: req.params.id,
            },
          });
          console.log(Order.length);
          if (Order.length <= 0) {
            return Boom.notFound("Order not found with id: " + req.params.id);
          }

          const resObj = await Order.map((Order) => {
            //tidy up the user data
            console.log(Order);
            return Object.assign(
              {},
              {
                order_id: Order.order_id,
                order_date: Order.order_date,
                total_price: Order.Total_price,
                change: Order.Change,
                order_type: Order.order_type_id,
                user: Order.User.Fname + " " + Order.User.Lname,
                order_detail: Order.Order_details.map((Order_detail) => {
                  //tidy up the post data
                  return Object.assign(
                    {},
                    {
                      order_detail_id: Order_detail.order_detail_id,
                      amount: Order_detail.amount,
                      sub_total_price: Order_detail.sub_total_price,
                      menu_name: Order_detail.Menu.Menu_name,
                      addons: Order_detail.Addons.map((Addons) => {
                        return Object.assign(
                          {},
                          {
                            addon_id: Addons.addon_id,
                            price: Addons.price,
                            name: Addons.Menu.Menu_name,
                          }
                        );
                      }),
                    }
                  );
                }),
              }
            );
          });
          return h.response(resObj);
        },
      },
    },
    {
      method: "POST",
      path: "/order",
      config: {
        description: "Insert order",
        notes: "Insert order",
        tags: ["api"],
        auth: "jwt",
        validate: {
          payload: {
            total_price: Joi.number().required(),
            change: Joi.number().required(),
            order_type: Joi.number().required(),
            user: Joi.number().required(),
            order_detail: Joi.array().items(
              Joi.object().keys({
                amount: Joi.number().required(),
                sub_total_price: Joi.number().required(),
                mid: Joi.number().integer().required(),
                addons: Joi.array().items(
                  Joi.object().keys({
                    price: Joi.number().required(),
                    mid: Joi.number().integer().required(),
                  })
                ),
              })
            ),
          },
        },
        handler: async (req, h) => {
          const order = await Models.Order.create({
            Total_price: req.payload.total_price,
            Change: req.payload.change,
            order_type_id: req.payload.order_type,
            uid: req.payload.user,
          });

          if (order == null) {
            return Boom.badRequest("Cannot insert order");
          }

          req.payload.order_detail.map(async (order_detail) => {
            const tmporder_detail = await Models.Order_detail.create({
              amount: order_detail.amount,
              sub_total_price: order_detail.sub_total_price,
              mid: order_detail.mid,
              order_id: order.order_id,
            });

            if (tmporder_detail == null) {
              return Boom.badRequest("Cannot insert order");
            }

            order_detail.addons.map(async (addons) => {
              const tmpaddons = await Models.Addons.create({
                price: addons.price,
                order_detail_id: tmporder_detail.order_detail_id,
                mid: addons.mid,
              });

              if (tmpaddons == null) {
                return Boom.badRequest("Cannot insert order");
              }
            });
          });

          return h.response(order.order_id);
          // return h.response("success!!!!");
        },
      },
    },
  ];
})();

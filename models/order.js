"use strict";

module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define(
    "Order",
    {
      order_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Total_price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Change: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      order_type_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      uid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Order",
    }
  );

  return Order;
};

"use strict";

module.exports = function (sequelize, DataTypes) {
  const Order_type = sequelize.define(
    "Order_type",
    {
      order_type_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Order_type",
    }
  );

  return Order_type;
};

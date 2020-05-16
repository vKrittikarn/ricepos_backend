"use strict";

module.exports = function (sequelize, DataTypes) {
  const Order_detail = sequelize.define(
    "Order_detail",
    {
      order_detail_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sub_total_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      mid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Order_detail",
    }
  );

  return Order_detail;
};

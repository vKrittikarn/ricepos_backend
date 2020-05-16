"use strict";

module.exports = function (sequelize, DataTypes) {
  const Addons = sequelize.define(
    "Addons",
    {
      addon_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      mid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      order_detail_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Addons",
    }
  );

  return Addons;
};

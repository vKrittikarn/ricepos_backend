"use strict";

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "Menu",
    {
      mid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      Menu_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mt_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Menu",
    }
  );

  return User;
};

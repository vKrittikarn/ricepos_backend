"use strict";

module.exports = function (sequelize, DataTypes) {
  const Menu_type = sequelize.define(
    "Menu_type",
    {
      mt_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      mt_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Menu_type",
    }
  );

  return Menu_type;
};

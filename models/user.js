"use strict";

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      uid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Fname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Lname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      underscored: true,
      tableName: "User",
    }
  );

  return User;
};

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const db = {};

const sequelize = new Sequelize("ricepos", "root", "kKwHqM8K", {
  host: "127.0.0.1",
  dialect: "mysql",
});

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Order, {
  foreignKey: "uid",
});
db.Order.belongsTo(db.User, {
  foreignKey: "uid",
});
db.Order.hasMany(db.Order_detail, {
  foreignKey: "order_id",
});
db.Menu.hasMany(db.Order_detail, {
  foreignKey: "mid",
});
db.Order_detail.belongsTo(db.Menu, {
  foreignKey: "mid",
});
db.Order_type.hasMany(db.Order, {
  foreignKey: "order_type_id",
});
db.Order.belongsTo(db.Order_type, {
  foreignKey: "order_type_id",
});

db.Order_detail.hasMany(db.Addons, {
  foreignKey: "order_detail_id",
});
db.Addons.belongsTo(db.Order_detail, {
  foreignKey: "order_detail_id",
});
db.Menu.hasMany(db.Addons, {
  foreignKey: "mid",
});
db.Addons.belongsTo(db.Menu, {
  foreignKey: "mid",
});

module.exports = db;

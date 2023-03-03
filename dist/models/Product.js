"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mysql_1 = require("../instances/mysql");
const sequelize_1 = require("sequelize");
exports.Product = mysql_1.sequelize.define('Product', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    input: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    output: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    total: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'product',
    timestamps: false,
});

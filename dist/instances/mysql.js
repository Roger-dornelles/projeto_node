"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.MYSQL_URI, 
// process.env.DATABASE_NAME as string,
// process.env.DATABASE_USER as string,
// process.env.DATABASE_PASSWORD as string,
{
    dialect: 'mysql',
    port: parseInt(process.env.DATABASE_PORT),
});
const connection = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
exports.connection = connection;
(0, exports.connection)();

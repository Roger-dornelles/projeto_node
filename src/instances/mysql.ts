import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
export const sequelize = new Sequelize(
  process.env.MYSQL_URI as string,
  // process.env.DATABASE_NAME as string,
  // process.env.DATABASE_USER as string,
  // process.env.DATABASE_PASSWORD as string,

  {
    dialect: 'mysql',
    port: parseInt(process.env.DATABASE_PORT as string),
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connection();

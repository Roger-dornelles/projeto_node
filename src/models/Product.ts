import { sequelize } from '../instances/mysql';
import { Model, DataTypes } from 'sequelize';

export interface ProductInstance extends Model {
  id: number;
  userId: number;
  name: string;
  description: string;
  input: number;
  output: number;
  total: number;
  userName: string;
}

export const Product = sequelize.define<ProductInstance>(
  'Product',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    input: {
      type: DataTypes.NUMBER,
    },
    output: {
      type: DataTypes.NUMBER,
    },
    total: {
      type: DataTypes.NUMBER,
    },
  },
  {
    tableName: 'product',
    timestamps: false,
  }
);

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CreateUserInstance extends Model {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const User = sequelize.define<CreateUserInstance>(
  'Users',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

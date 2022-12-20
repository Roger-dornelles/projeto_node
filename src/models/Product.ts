import { sequelize } from "../instances/mysql";
import {Model,DataTypes } from 'sequelize'

export interface ProductInstance extends Model{
    id:number;
    userId:Number;
    name:string;
    description:string;
    input:Number;
    output:Number;
    total:Number;
}

export const Product = sequelize.define<ProductInstance>(
    'Product',{
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:DataTypes.INTEGER
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.STRING,
            allowNull:false
        },
        input:{
            type:DataTypes.NUMBER,
        },
        output:{
            type:DataTypes.NUMBER
        },
        total:{
            type:DataTypes.NUMBER
        }
    },{
        tableName:'product',
        timestamps:false
    }
)
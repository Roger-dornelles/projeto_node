import passport from 'passport';
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { Request, Response } from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
const routes = require('./routes/index')

dotenv.config();


const server = express();

const errorHandler =({err,req,res,next}:any) => {
    if(err.status){
        res.status(err.status);
    }else{
        res.status(400);
    }
    
    if(err.message){
        res.json({error:err.message});
    }else{
        res.json({error:'Ocorreu um erro.'});
    }
};

server.use(express.json())
server.use(cors())
server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(express.static(path.join(__dirname, '../public')))
server.use(passport.initialize())
server.use(routes)
server.use((req:Request,res:Response) => {
    res.status(404).json({error:'endpoint not found'});
})
server.use(errorHandler)
server.listen(process.env.PORT, () => 'server running on port 4000')

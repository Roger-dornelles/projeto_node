import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    email:string
}
export interface UserProps extends Request {
    email:string;
    id:Number;
    iat:Number
}

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Token invalido');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        let userlogged = await User.findOne({where:{email:decoded.email}})
        if(userlogged?.email === decoded.email){
            
            req.user = decoded 
            next();
        }else{
            res.status(500).json("Não autorizado.")
        }

    } catch (err) {
        res.status(401).json({error:'Usuário não autenticado.'});
    }
};

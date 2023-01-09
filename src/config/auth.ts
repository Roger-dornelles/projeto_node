import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface TokenInterface {
  email: string;
  name: string;
  id: number;
}

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Token invalido');
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (decoded) {
      req.user = decoded as TokenInterface;
      next();
    } else {
      res.status(500).json({ error: 'Não autorizado.' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Usuário não autenticado.' });
  }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privateRoute = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Token invalido');
        }
        let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded) {
            req.user = decoded;
            next();
        }
        else {
            res.status(401).json({ error: 'Não autorizado.' });
        }
    }
    catch (err) {
        res.status(401).json({ error: 'Usuário não autenticado.' });
    }
};
exports.privateRoute = privateRoute;

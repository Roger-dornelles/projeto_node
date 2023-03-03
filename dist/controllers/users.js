"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoUser = exports.deleteUser = exports.signin = exports.update = exports.create = void 0;
const User_1 = require("../models/User");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password } = req.body;
    try {
        if (!name || !password || !email) {
            return res.status(400).json({ message: 'Preencha todos os campos...' });
        }
        if (name) {
            let regex = /^([A-Za-z]\s?){2,30}$/;
            let isNameValid = regex.test(name);
            if (!isNameValid) {
                return res.status(400).json({ message: 'Digite um nome valido.' });
            }
        }
        else {
            return res.status(400).json({ message: 'Digite seu Nome.' });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: 'Digite um Email valido.' });
        }
        let userEmail = yield User_1.User.findOne({ where: { email } });
        if ((userEmail === null || userEmail === void 0 ? void 0 : userEmail.email) === email) {
            return res.status(200).json({ message: 'Email já cadastrado.' });
        }
        let passwordHash = '';
        if (password) {
            let regex = /^[0-9a-zA-Z]{8,}$/;
            let isPasswordValid = regex.test(password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Digite uma senha valida.' });
            }
            else {
                passwordHash = yield bcrypt_1.default.hashSync(password, 10);
            }
        }
        else {
            return res.status(400).json({ message: 'Digite uma Senha.' });
        }
        name = name.toLowerCase();
        let nameFormated = name.split(' ')[0];
        name = nameFormated[0].toUpperCase() + name.substring(1);
        let newUser = yield User_1.User.create({
            name,
            email,
            password: passwordHash,
        });
        if (newUser) {
            let token = yield jsonwebtoken_1.default.sign({ email: newUser.email, id: newUser.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '12h',
            });
            return res.status(201).json({ token });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password } = req.body;
    const { id } = req.params;
    try {
        let user = yield User_1.User.findOne({ where: { id } });
        if (user) {
            if (name) {
                name = name.toLowerCase();
                let nameFormated = name.split(' ')[0];
                name = nameFormated[0].toUpperCase() + name.substring(1);
                user.name = name;
            }
            if (email) {
                if (validator_1.default.isEmail(email)) {
                    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$/;
                    if (reg.test(email)) {
                        user.email = email;
                    }
                }
                else {
                    return res.status(200).json({ error: 'Digite um email valido.' });
                }
            }
            if (password) {
                let regex = /^[0-9a-zA-Z]{8,}$/;
                let isPasswordValid = regex.test(password);
                if (isPasswordValid) {
                    user.password = yield bcrypt_1.default.hashSync(password, 10);
                }
                else {
                    return res.status(400).json({ error: 'Senha invalida' });
                }
            }
            yield user.save();
            return res.status(201).json({ message: 'Dados atualizados...' });
        }
        else {
            return res.status(404).json({ error: 'Usuário inexistente.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.update = update;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Preencha todos os campos.' });
        }
        if (email && validator_1.default.isEmail(email)) {
            let user = yield User_1.User.findOne({ where: { email } });
            if (user) {
                let isPasswordValid = yield bcrypt_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
                if (isPasswordValid) {
                    let token = yield jsonwebtoken_1.default.sign({ email: user === null || user === void 0 ? void 0 : user.email, id: user === null || user === void 0 ? void 0 : user.id }, process.env.JWT_SECRET_KEY, {
                        expiresIn: '12h',
                    });
                    return res.status(201).json({ token });
                }
                else {
                    return res.status(403).json({ error: 'Senha invalida.' });
                }
            }
        }
        else {
            return res.status(403).json({ error: 'Email invalido' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.signin = signin;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const user = yield User_1.User.findByPk(id);
        if (user) {
            yield user.destroy();
            res.status(201).json({ message: 'Usuário excluido com sucesso...' });
        }
        else {
            return res.status(404).json({ message: 'Usuário não encontrado...' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.deleteUser = deleteUser;
const infoUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { email } = req.user;
    try {
        let user = yield User_1.User.findByPk(id);
        if ((user === null || user === void 0 ? void 0 : user.email) === email) {
            return res.status(201).json(user);
        }
        else {
            return res.status(404).json({ error: 'Usuário não encontrado...' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'ocorreu um erro, tente mais tarde.' });
    }
});
exports.infoUser = infoUser;

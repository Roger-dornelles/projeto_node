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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProducts = exports.getProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const User_1 = require("./../models/User");
const Product_1 = require("../models/Product");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, input } = req.body;
    const { id } = req.params;
    try {
        if (!name || !description || !input) {
            return res.status(404).json({ message: 'Preencha todos os campos.' });
        }
        const bankVerifiedProduct = yield Product_1.Product.findOne({
            where: {
                name: name.toLowerCase(),
                description: description.toLowerCase(),
            },
        });
        const userVerified = yield User_1.User.findOne({ where: { id } });
        if (bankVerifiedProduct) {
            return res.status(200).json({ error: 'Produto já cadastrado.' });
        }
        if (name && description) {
            name = name.toLowerCase();
            description = description.toLowerCase();
        }
        yield Product_1.Product.create({
            name,
            description,
            userId: id,
            input,
            total: input,
            output: 0,
            userName: (userVerified === null || userVerified === void 0 ? void 0 : userVerified.name) ? userVerified === null || userVerified === void 0 ? void 0 : userVerified.name : 'Indefinido',
        });
        return res.status(201).json({ message: 'Produto cadastrado com sucesso...' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, input, output } = req.body;
        let { id } = req.params;
        let product = yield Product_1.Product.findOne({ where: { id } });
        if (product) {
            if (name) {
                Object(product).name = name;
            }
            if (description) {
                Object(product).description = description;
            }
            if (input) {
                Object(product).input = Object(product).input + Number(input);
                Object(product).total = Object(product).total + Number(input);
            }
            if (Object(product).total < Number(output)) {
                return res.status(200).json({ error: 'Quantidade em estoque menor que a quantidade solicitada.' });
            }
            if (output) {
                Object(product).total = output && Object(product).total - Number(output);
                Object(product).output = output && Object(product).output + Number(output);
            }
            yield product.save();
            return res.status(201).json({ message: 'Produto atualizado.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não cadastrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let product = yield Product_1.Product.findOne({ where: { id } });
        if (product) {
            yield product.destroy();
            return res.status(200).json({ message: 'Produto excluido com sucesso.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.deleteProduct = deleteProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        if (id) {
            let product = yield Product_1.Product.findOne({ where: { id } });
            const user = yield User_1.User.findOne({
                where: {
                    id: product === null || product === void 0 ? void 0 : product.userId,
                },
            });
            Object(product).userName = user === null || user === void 0 ? void 0 : user.name;
            product ? res.status(201).json({ product }) : res.status(404).json({ message: 'Produto não cadastrado.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.getProduct = getProduct;
const allProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.findAll();
        if (products) {
            res.status(201).json({ products });
        }
        else {
            res.status(404).json({ message: 'Nenhum produto encontrado.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
});
exports.allProducts = allProducts;

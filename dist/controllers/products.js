"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProducts = exports.getProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const User_1 = require("./../models/User");
const Product_1 = require("../models/Product");
const createProduct = async (req, res) => {
    let { name, description, input } = req.body;
    const { id } = req.params;
    try {
        if (!name || !description || !input) {
            return res.status(404).json({ message: 'Preencha todos os campos.' });
        }
        const bankVerifiedProduct = await Product_1.Product.findOne({
            where: {
                name: name.toLowerCase(),
                description: description.toLowerCase(),
            },
        });
        const userVerified = await User_1.User.findOne({ where: { id } });
        if (bankVerifiedProduct) {
            return res.status(200).json({ error: 'Produto já cadastrado.' });
        }
        if (name && description) {
            name = name.toLowerCase();
            description = description.toLowerCase();
        }
        await Product_1.Product.create({
            name,
            description,
            userId: id,
            input,
            total: input,
            output: 0,
            userName: userVerified?.name ? userVerified?.name : 'Indefinido',
        });
        return res.status(201).json({ message: 'Produto cadastrado com sucesso...' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        let { name, description, input, output } = req.body;
        let { id } = req.params;
        let product = await Product_1.Product.findOne({ where: { id } });
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
            await product.save();
            return res.status(201).json({ message: 'Produto atualizado.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não cadastrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let product = await Product_1.Product.findOne({ where: { id } });
        if (product) {
            await product.destroy();
            return res.status(200).json({ message: 'Produto excluido com sucesso.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
};
exports.deleteProduct = deleteProduct;
const getProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (id) {
            let product = await Product_1.Product.findOne({ where: { id } });
            const user = await User_1.User.findOne({
                where: {
                    id: product?.userId,
                },
            });
            Object(product).userName = user?.name;
            product ? res.status(201).json({ product }) : res.status(404).json({ message: 'Produto não cadastrado.' });
        }
        else {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
    }
};
exports.getProduct = getProduct;
const allProducts = async (req, res) => {
    try {
        const products = await Product_1.Product.findAll();
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
};
exports.allProducts = allProducts;

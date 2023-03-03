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
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mysql_1 = require("../instances/mysql");
describe('testing the product route.', () => {
    let email = 'teste@teste.com';
    let password = '12345678';
    let user;
    let token;
    let name = 'Prego teste';
    let description = '5X12 teste';
    let input = 25;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // check dataBase connection
        yield (0, mysql_1.connection)();
        user = yield User_1.User.findOne({ where: { email: email } });
    }));
    it('should return login', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send(`email=${email}&password=${password}`)
            .then((response) => {
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).not.toBeUndefined();
            expect(response.body.token).not.toBeNull();
            token = response.body.token;
            return done();
        });
    });
    it('should return error authentication ', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post(`/product/create/${user === null || user === void 0 ? void 0 : user.id}`)
            .then((response) => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).not.toBeNaN();
            expect(response.body.error).not.toBeUndefined();
            return done();
        });
    });
    it('should message error authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name: name, description: description } });
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/delete/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .then((response) => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não autenticado.');
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
        });
    }));
    it('should return message fill all fields ', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post(`/product/create/${user === null || user === void 0 ? void 0 : user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(`name=${name}&description=${description}&userId=${user === null || user === void 0 ? void 0 : user.id}&input=${''}&total=${''}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).not.toBeNull();
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).toBe('Preencha todos os campos.');
            return done();
        });
    });
    it('should return create product', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post(`/product/create/${user === null || user === void 0 ? void 0 : user.id}`)
            .send(`name=${name}&description=${description}&input=${input}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
            expect(response.body.message).toBe('Produto cadastrado com sucesso...');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
            expect(response.body).not.toContain('error');
        });
    }));
    it('should return product update (add product) message', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/update/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .send(`input=${30}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Produto atualizado.');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
        });
    }));
    it('should return product update (remove product) message', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/update/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .send(`output=${30}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Produto atualizado.');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
        });
    }));
    it('should return product update (update product description) message', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/update/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .send(`description=${'description product'}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Produto atualizado.');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
        });
    }));
    it('should return product update (update product input) message', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/update/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .send(`input=${30}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Produto atualizado.');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
        });
    }));
    it('should return product update (update product output) message', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/update/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .send(`output=${30}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Produto atualizado.');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).not.toBeNull();
        });
    }));
    it('should return authentication error', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .get(`/product/view/${product === null || product === void 0 ? void 0 : product.id}`)
            .then((response) => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não autenticado.');
            expect(response.body.error).not.toBeUndefined();
            expect(response.body.error).not.toBeNull();
        });
    }));
    it('should return product', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .get(`/product/view/${product === null || product === void 0 ? void 0 : product.id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('product');
            expect(response.body.product).toHaveProperty('id');
            expect(response.body.product).not.toBeUndefined();
            expect(response.body.product).not.toBeNull();
        });
    }));
    it('should return authentication error', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/delete/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .then((response) => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não autenticado.');
            expect(response.body.error).not.toBeUndefined();
            expect(response.body.error).not.toBeNull();
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
        });
    }));
    it('should return delete product', () => __awaiter(void 0, void 0, void 0, function* () {
        let product = yield Product_1.Product.findOne({ where: { name } });
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/delete/product/${product === null || product === void 0 ? void 0 : product.id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body.message).toBe('Produto excluido com sucesso.');
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
        });
    }));
});

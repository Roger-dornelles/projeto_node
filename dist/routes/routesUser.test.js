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
const User_1 = require("../models/User");
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mysql_1 = require("../instances/mysql");
describe('testing the User route', () => {
    let email = 'teste@teste.com';
    let password = '12345678';
    let user;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // check dataBase connection
        yield (0, mysql_1.connection)();
        user = yield User_1.User.findOne({ where: { email: 'teste@gmail.com' } });
    }));
    it('should return test route', (done) => {
        (0, supertest_1.default)(app_1.default)
            .get('/test')
            .then((response) => {
            expect(response.body).not.toBeUndefined();
            expect(response.body.message).toBe('route test...');
            expect(response.body).toHaveProperty('message');
            return done();
        });
    });
    it('should return error or message create user ', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(' ')
            .then((response) => {
            expect(response.body.message).toBe('Preencha todos os campos...');
            expect(response.body).not.toBeUndefined();
            expect(response.body.message).not.toBeUndefined();
            return done();
        });
    });
    it('should return error or message create user (name)', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(`email=${email}&password=${password}&name=${''}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body).not.toHaveProperty('error');
            return done();
        });
    });
    it('should return error or message create user (password)', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(`email=${email}&password={' '}$name=${'Test antunes'}`)
            .then((response) => {
            expect(response.body.message).not.toBeUndefined();
            expect(response.body).not.toHaveProperty('error');
            expect(response.body.message).toBe('Preencha todos os campos...');
            return done();
        });
    });
    it('should return error or message create user (email)', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(`email=${''}&password=${password}&name=${'Test antunes'}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).not.toBeUndefined();
            expect(response.body.message).toBe('Preencha todos os campos...');
            return done();
        });
    });
    it('should return message create user (email)', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(`email=${'teste@teste.c'}&password=${password}&name=${'Test antunes'}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Digite um Email valido.');
            expect(response.body).not.toHaveProperty('error');
            return done();
        });
    });
    it('should return create user ', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/create')
            .send(`email=${'teste@gmail.com'}&password=${password}&name=${'Ricardo'}`)
            .then((response) => {
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).not.toBeUndefined();
            expect(response.body.token).not.toBeNull();
            return done();
        });
    });
    it('should return login path', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send(`email=${'teste@gmail.com'}&password=${password}`)
            .then((response) => {
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).not.toBeUndefined();
            expect(response.body.token).not.toBeNull();
            token = response.body.token;
            return done();
        });
    });
    it('should return login path', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/login')
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body).not.toBeUndefined();
            expect(response.body.message).not.toBeUndefined();
            return done();
        });
    });
    it('should return login path', (done) => {
        (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send(` `)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Preencha todos os campos.');
            return done();
        });
    });
    it('should return error message', (done) => {
        (0, supertest_1.default)(app_1.default)
            .put(`/user/update/${user === null || user === void 0 ? void 0 : user.id}`)
            .then((response) => {
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não autenticado.');
            return done();
        });
    });
    it('should return user update', () => __awaiter(void 0, void 0, void 0, function* () {
        user = yield User_1.User.findOne({ where: { email: 'teste@gmail.com' } });
        yield (0, supertest_1.default)(app_1.default)
            .put(`/user/update/${user === null || user === void 0 ? void 0 : user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Dados atualizados...');
        });
    }));
    it('should return error delete user', (done) => {
        (0, supertest_1.default)(app_1.default)
            .delete(`/user/delete/${user === null || user === void 0 ? void 0 : user.id}`)
            .then((response) => {
            expect(response.body).not.toBeUndefined();
            expect(response.body).not.toBeNull();
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não autenticado.');
            return done();
        });
    });
    it('should return exclude user', () => __awaiter(void 0, void 0, void 0, function* () {
        user = yield User_1.User.findOne({ where: { email: 'teste@gmail.com' } });
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/user/delete/${user === null || user === void 0 ? void 0 : user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Usuário excluido com sucesso...');
        });
    }));
});

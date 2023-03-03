"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const server = (0, express_1.default)();
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const errorHandler = ({ err, req, res, next }) => {
    if (err.status) {
        res.status(err.status);
    }
    else {
        res.status(400);
    }
    if (err.message) {
        res.json({ error: err.message });
    }
    else {
        res.json({ error: 'Ocorreu um erro.' });
    }
};
server.use(express_1.default.json());
server.use((0, cors_1.default)());
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(body_parser_1.default.json());
server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
server.use(passport_1.default.initialize());
server.use(index_1.default);
server.use((req, res) => {
    res.status(404).json({ error: 'endpoint not found' });
});
server.use(errorHandler);
exports.default = server;

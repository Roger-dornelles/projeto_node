"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test = (req, res) => {
    res.status(200).json({ message: 'route test...' });
};
exports.test = test;

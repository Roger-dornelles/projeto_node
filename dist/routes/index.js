"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RouteTest = __importStar(require("../controllers/routeTest"));
const userController = __importStar(require("../controllers/users"));
const productController = __importStar(require("../controllers/products"));
const auth_1 = require("../config/auth");
const route = (0, express_1.Router)();
route.get('/test', RouteTest.test);
route.post('/login', userController.signin);
route.post('/create', userController.create);
route.put('/user/update/:id', auth_1.privateRoute, userController.update);
route.delete('/user/delete/:id', auth_1.privateRoute, userController.deleteUser);
route.get('/user/info/:id', auth_1.privateRoute, userController.infoUser);
route.get('/products/all', auth_1.privateRoute, productController.allProducts);
route.post('/product/create/:id', auth_1.privateRoute, productController.createProduct);
route.delete('/delete/product/:id', auth_1.privateRoute, productController.deleteProduct);
route.put('/update/product/:id', auth_1.privateRoute, productController.updateProduct);
route.get('/product/view/:id', auth_1.privateRoute, productController.getProduct);
exports.default = route;

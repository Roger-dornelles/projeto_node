import { Router } from 'express';
import * as RouteTest from '../controllers/routeTest';
import * as userController from '../controllers/users';
import * as productController from '../controllers/products';
import { privateRoute } from '../config/auth';
const route = Router();

route.get('/test', RouteTest.test);
route.post('/login', userController.signin);
route.post('/create', userController.create);
route.put('/user/update/:id', privateRoute, userController.update);
route.delete('/user/delete/:id', privateRoute, userController.deleteUser);
route.get('/user/info/:id', privateRoute, userController.infoUser);

route.post('/product/create/:id', privateRoute, productController.createProduct);
route.delete('/delete/product/:id', privateRoute, productController.deleteProduct)

export default route;

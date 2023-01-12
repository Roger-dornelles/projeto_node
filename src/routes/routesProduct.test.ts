import { Product } from '../models/Product';
import { User, CreateUserInstance } from '../models/User';
import app from '../app';
import request from 'supertest';
import { connection } from '../instances/mysql';

describe('testing the product route.', () => {
  let email = 'teste@teste.com';
  let password = '12345678';
  let user: CreateUserInstance | null;
  let token: string;

  let name = 'Prego teste';
  let description = '5X12 teste';
  let input = 25;

  beforeAll(async () => {
    // check dataBase connection
    await connection();

    user = await User.findOne({ where: { email: email } });
  });

  it('should return login', (done) => {
    request(app)
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
    request(app)
      .post(`/product/create/${user?.id}`)
      .then((response) => {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).not.toBeNaN();
        expect(response.body.error).not.toBeUndefined();
        return done();
      });
  });

  it('should message error authentication', async () => {
    let product = await Product.findOne({ where: { name: name, description: description } });

    await request(app)
      .delete(`/delete/product/${product?.id}`)
      .then((response) => {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Usuário não autenticado.');
        expect(response.body).not.toBeUndefined();
        expect(response.body).not.toBeNull();
      });
  });

  it('should return message fill all fields ', (done) => {
    request(app)
      .post(`/product/create/${user?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(`name=${name}&description=${description}&userId=${user?.id}&input=${''}&total=${''}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).not.toBeNull();
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).toBe('Preencha todos os campos.');

        return done();
      });
  });

  it('should return create product', async () => {
    await request(app)
      .post(`/product/create/${user?.id}`)
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
  });

  it('should return product update (add product) message', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .put(`/update/product/${product?.id}`)
      .send(`input=${30}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Produto atualizado.');
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).not.toBeNull();
      });
  });

  it('should return product update (remove product) message', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .put(`/update/product/${product?.id}`)
      .send(`output=${30}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Produto atualizado.');
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).not.toBeNull();
      });
  });

  it('should return product update (update product description) message', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .put(`/update/product/${product?.id}`)
      .send(`description=${'description product'}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Produto atualizado.');
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).not.toBeNull();
      });
  });

  it('should return product update (update product input) message', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .put(`/update/product/${product?.id}`)
      .send(`input=${30}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Produto atualizado.');
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).not.toBeNull();
      });
  });

  it('should return product update (update product output) message', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .put(`/update/product/${product?.id}`)
      .send(`output=${30}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Produto atualizado.');
        expect(response.body.message).not.toBeUndefined();
        expect(response.body.message).not.toBeNull();
      });
  });

  it('should return authentication error', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .get(`/product/view/${product?.id}`)
      .then((response) => {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Usuário não autenticado.');
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).not.toBeNull();
      });
  });

  it('should return product', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .get(`/product/view/${product?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toHaveProperty('product');
        expect(response.body.product).toHaveProperty('id');
        expect(response.body.product).not.toBeUndefined();
        expect(response.body.product).not.toBeNull();
      });
  });

  it('should return authentication error', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .delete(`/delete/product/${product?.id}`)
      .then((response) => {
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Usuário não autenticado.');
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).not.toBeNull();
        expect(response.body).not.toBeUndefined();
        expect(response.body).not.toBeNull();
      });
  });

  it('should return delete product', async () => {
    let product = await Product.findOne({ where: { name } });

    await request(app)
      .delete(`/delete/product/${product?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body.message).toBe('Produto excluido com sucesso.');
        expect(response.body).not.toBeUndefined();
        expect(response.body).not.toBeNull();
      });
  });
});

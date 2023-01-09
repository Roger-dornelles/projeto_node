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
  let input = 15;

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
});

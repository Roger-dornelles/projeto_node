import { User, CreateUserInstance } from './../models/User';
import app from '../app';
import request from 'supertest';
import { connection } from '../instances/mysql';

describe('testing API test route', () => {
  let email = 'teste@teste.com';
  let password = '12345678';
  let user: CreateUserInstance | null;

  beforeAll(async () => {
    // check dataBase connection
    await connection();
    user = await User.findOne({ where: { email: 'teste@gmail.com' } });
    if (user) {
      await user.destroy();
    }
  });

  it('should return test route', (done) => {
    request(app)
      .get('/test')
      .then((response) => {
        expect(response.body).not.toBeUndefined();
        expect(response.body.message).toBe('route test...');
        expect(response.body).toHaveProperty('message');
        return done();
      });
  });

  it('should return login path', (done) => {
    request(app)
      .post('/login')
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).not.toBeUndefined();
        return done();
      });
  });

  it('should return login path', (done) => {
    request(app)
      .post('/login')
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body).not.toBeUndefined();
        expect(response.body.message).not.toBeUndefined();
        return done();
      });
  });

  it('should return login path', (done) => {
    request(app)
      .post('/login')
      .send(` `)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Preencha todos os campos.');
        return done();
      });
  });

  it('should return error or message create user ', (done) => {
    request(app)
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
    request(app)
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
    request(app)
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
    request(app)
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
    request(app)
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
    request(app)
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

  it('should return error delete user', (done) => {
    request(app)
      .delete(`/user/delete/${user?.id as unknown}`)
      .then((response) => {
        expect(response.body).not.toBeUndefined();
        expect(response.body).not.toBeNull();
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Usuário não autenticado.');
        return done();
      });
  });
});

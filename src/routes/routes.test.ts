import app from '../app';
import request from 'supertest';
import { connection } from '../instances/mysql';

describe('testing API test route', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let email = 'teste@teste.com';
  let password = '12345678';
  beforeAll(async () => {
    await connection();
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
});

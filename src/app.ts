import passport from 'passport';
import express from 'express';
import path from 'path';
import { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index';

const server = express();

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const errorHandler = ({ err, req, res, next }: any) => {
  if (err.status) {
    res.status(err.status);
  } else {
    res.status(400);
  }

  if (err.message) {
    res.json({ error: err.message });
  } else {
    res.json({ error: 'Ocorreu um erro.' });
  }
};

server.use(express.json());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(passport.initialize());
server.use(routes);
server.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'endpoint not found' });
});
server.use(errorHandler);

export default server;

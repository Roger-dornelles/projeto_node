import { Request, Response } from 'express';
import { User } from '../models/User';
import validator from 'validator';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { SigninProps, CreateUserProps } from '../types/Users';

export const create = async (req: Request, res: Response) => {
  let { name, email, password }: CreateUserProps = req.body;

  try {
    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Preencha todos os campos...' });
    }

    if (name) {
      let regex = /^([A-Za-z]\s?){2,30}$/;
      let isNameValid = regex.test(name);
      if (!isNameValid) {
        return res.status(400).json({ message: 'Digite um nome valido.' });
      }
    } else {
      return res.status(400).json({ message: 'Digite seu Nome.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Digite um Email valido.' });
    }

    let userEmail = await User.findOne({ where: { email } });
    if (userEmail?.email === email) {
      return res.status(200).json({ message: 'Email já cadastrado.' });
    }

    let passwordHash = '';
    if (password) {
      let regex = /^[0-9a-zA-Z]{8,}$/;
      let isPasswordValid = regex.test(password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Digite uma senha valida.' });
      } else {
        passwordHash = await bcrypt.hashSync(password, 10);
      }
    } else {
      return res.status(400).json({ message: 'Digite uma Senha.' });
    }
    name = name.toLowerCase();
    let nameFormated = name.split(' ')[0];
    name = nameFormated[0].toUpperCase() + name.substring(1);
    let newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });

    if (newUser) {
      let token = await Jwt.sign({ email: newUser.email, id: newUser.id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '12h',
      });
      return res.status(201).json({ token });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const update = async (req: Request, res: Response) => {
  let { name, email, password }: CreateUserProps = req.body;
  const { id } = req.params;
  try {
    let user = await User.findOne({ where: { id } });
    if (user) {
      if (name) {
        name = name.toLowerCase();
        let nameFormated = name.split(' ')[0];
        name = nameFormated[0].toUpperCase() + name.substring(1);
        user.name = name;
      }

      if (email) {
        if (validator.isEmail(email)) {
          let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$/;
          if (reg.test(email)) {
            user.email = email;
          }
        } else {
          return res.status(200).json({ error: 'Digite um email valido.' });
        }
      }

      if (password) {
        let regex = /^[0-9a-zA-Z]{8,}$/;
        let isPasswordValid = regex.test(password);
        if (isPasswordValid) {
          user.password = password;
        } else {
          return res.status(400).json({ error: 'Senha invalida' });
        }
      }

      await user.save();

      return res.status(201).json({ message: 'Dados atualizados...' });
    } else {
      return res.status(404).json({ error: 'Usuário inexistente.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const signin = async (req: Request, res: Response) => {
  let { email, password }: SigninProps = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    if (email && validator.isEmail(email)) {
      let user = await User.findOne({ where: { email } });

      if (user) {
        let isPasswordValid = await bcrypt.compareSync(password, user?.password as string);

        if (isPasswordValid) {
          let token = await Jwt.sign({ email: user?.email, id: user?.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '12h',
          });

          return res.status(201).json({ token });
        } else {
          return res.status(403).json({ error: 'Senha invalida.' });
        }
      }
    } else {
      return res.status(403).json({ error: 'Email invalido' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  let { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(201).json({ message: 'Usuário excluido com sucesso...' });
    } else {
      return res.status(404).json({ message: 'Usuário não encontrado...' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const infoUser = async (req: Request, res: Response) => {
  let { id } = req.params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { email }: any = req.user;

  try {
    let user = await User.findByPk(id);

    if (user?.email === email) {
      return res.status(201).json(user);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado...' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'ocorreu um erro, tente mais tarde.' });
  }
};

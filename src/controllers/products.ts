import { CreateProduct } from './../types/Product';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  let { name, description, input }: CreateProduct = req.body;
  const userId = req.user && req.user.id;

  try {
    if (!name || !description || !input) {
      return res.status(404).json({ message: 'Preencha todos os campos.' });
    }

    const bankVerifiedProduct = await Product.findAll({
      where: {
        name: name.toLowerCase(),
        description: description.toLowerCase(),
      },
    });
    if (bankVerifiedProduct) {
      return res.status(200).json({ message: 'Produto já cadastrado.' });
    }
    if (name && description) {
      name = name.toLowerCase();
      description = description.toLowerCase();
    }

    await Product.create({
      name,
      description,
      userId,
      input,
      total: input,
    });
    return res.status(201).json({ message: 'Produto cadastrado com sucesso...' });
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

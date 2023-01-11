import { CreateProduct, UpdateProductProps } from '../types/Product';
import { Product } from '../models/Product';
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  let { name, description, input }: CreateProduct = req.body;
  const { id } = req.params;

  try {
    if (!name || !description || !input) {
      return res.status(404).json({ message: 'Preencha todos os campos.' });
    }

    const bankVerifiedProduct = await Product.findOne({
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
      userId: id,
      input,
      total: input,
      output: 0,
    });

    return res.status(201).json({ message: 'Produto cadastrado com sucesso...' });
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    let { name, description, input, output } = req.body;
    let { id } = req.params;

    let product = await Product.findOne({ where: { id } });
    if (product) {
      if (name) {
        Object(product).name = name;
      }

      if (description) {
        Object(product).description = description;
      }

      if (input) {
        Object(product).input = Number(input);
        Object(product).total + Number(input);
      }

      if (output && Object(product).total >= Number(output)) {
        Object(product).output = output;
        Object(product).total = Object(product).total - Number(output);
      } else {
        return res.status(200).json({ message: 'Quantidade em estoque menor que a quantidade solicitada.' });
      }

      product && (await product.save());
      return res.status(201).json({ message: 'Produto atualizado.' });
    } else {
      return res.status(404).json({ message: 'Produto não cadastrado.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let product = await Product.findOne({ where: { id } });
    if (product) {
      await product.destroy();
      return res.status(200).json({ message: 'Produto excluido com sucesso.' });
    } else {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    if (id) {
      let product = await Product.findOne({ where: { id } });

      product ? res.status(201).json({ product }) : res.status(404).json({ message: 'Produto não cadastrado.' });
    } else {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro, tente mais tarde.' });
  }
};

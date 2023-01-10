export type CreateProduct = {
  id: number;
  userId?: number;
  name: string;
  description: string;
  input: number;
  output?: number;
  total: number;
};

export type UpdateProductProps = {
  name: string;
  description: string;
  input?: number;
  output?: number;
  total: number | null;
};

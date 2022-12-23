export type SigninProps = {
  email: string;
  password: string;
};

export type CreateUserProps = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type UpdateUserProps = {
  id: number;
  email: string;
  passport: string;
  name: string;
};

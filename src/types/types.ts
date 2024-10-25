export interface IActionCommand<T> {
  type: string;
  data: T;
  id: number;
}

export interface IRegisterUser {
  name: string;
  password: string;
  error?: boolean;
  errorText?: string;
}

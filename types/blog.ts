export interface Blog {
  id: string;
  title: string;
  body: string;
  author: string;
}

export interface User {
  token: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}
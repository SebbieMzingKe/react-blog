export interface Blog {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  excerpt?: string;
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

export interface BlogFormData {
  title: string;
  body: string;
  tags: string[];
  excerpt: string;
}
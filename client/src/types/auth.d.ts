export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

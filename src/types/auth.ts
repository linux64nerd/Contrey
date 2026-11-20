export type AuthMethod = 'phone' | 'email' | 'google' | 'userid';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  authMethod: AuthMethod;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

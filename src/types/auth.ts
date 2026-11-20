export type AuthMethod = 'phone' | 'email' | 'google' | 'userid';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  authMethod: AuthMethod;
  avatar?: string;
  upiId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PhoneLoginPayload {
  countryCode: string;
  phone: string;
  otp: string;
}

export interface EmailLoginPayload {
  email: string;
  password: string;
}

export interface EmailSignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserIdLoginPayload {
  userId: string;
  password: string;
}

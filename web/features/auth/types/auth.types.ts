export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'MANAGER';
  organizationId: string;
}

export interface AuthTokens {
  access_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'AGENT' | 'MANAGER';
  organizationId: string;
}

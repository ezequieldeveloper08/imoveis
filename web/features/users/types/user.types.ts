export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  avatar?: string;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ezequiel Pires',
    email: 'ezequiel@simovel.com',
    role: 'ADMIN',
    department: 'Diretoria',
    status: 'active',
    lastLogin: '2024-03-08T15:30:00Z',
  },
  {
    id: '2',
    name: 'Amanda Oliveira',
    email: 'amanda.o@simovel.com',
    role: 'MANAGER',
    department: 'Vendas SP',
    status: 'active',
    lastLogin: '2024-03-08T09:15:00Z',
  },
  {
    id: '3',
    name: 'Ricardo Lemos',
    email: 'ricardo.l@simovel.com',
    role: 'AGENT',
    department: 'Vendas SP',
    status: 'inactive',
    lastLogin: '2024-03-05T18:45:00Z',
  }
];

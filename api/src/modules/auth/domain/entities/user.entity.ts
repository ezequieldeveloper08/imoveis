export class User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'MANAGER';
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

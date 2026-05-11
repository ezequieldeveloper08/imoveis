export class User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'MANAGER';
  department?: string;
  status: 'active' | 'inactive';
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

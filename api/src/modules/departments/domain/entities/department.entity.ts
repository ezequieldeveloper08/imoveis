export class Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  manager?: string;
  memberCount?: number;
  color?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Department>) {
    Object.assign(this, partial);
  }
}

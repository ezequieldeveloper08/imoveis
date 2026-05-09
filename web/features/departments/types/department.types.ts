export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string; // Name of the manager
  memberCount: number;
  color: string; // Hex color for the department
  createdAt: string;
}

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Vendas SP',
    description: 'Equipe focada em imóveis residenciais de alto padrão em São Paulo.',
    manager: 'Amanda Oliveira',
    memberCount: 12,
    color: '#703BF7',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Criação de campanhas, anúncios e gestão de redes sociais.',
    manager: 'Ezequiel Pires',
    memberCount: 4,
    color: '#3B82F6',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'Administrativo',
    description: 'Gestão de contratos, jurídico e financeiro.',
    manager: 'Carlos Alberto',
    memberCount: 6,
    color: '#10B981',
    createdAt: '2024-01-05T08:30:00Z',
  }
];

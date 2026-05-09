export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'online' | 'offline';
  messages: Message[];
}

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    contactName: 'João Silva',
    contactAvatar: '',
    lastMessage: 'Olá, gostaria de saber mais sobre o imóvel em Alphaville.',
    timestamp: '14:20',
    unreadCount: 2,
    status: 'online',
    messages: [
      { id: '1', text: 'Bom dia! Tudo bem?', sender: 'them', timestamp: '14:15', status: 'read' },
      { id: '2', text: 'Olá, gostaria de saber mais sobre o imóvel em Alphaville.', sender: 'them', timestamp: '14:20', status: 'read' },
    ]
  },
  {
    id: '2',
    contactName: 'Maria Oliveira',
    contactAvatar: '',
    lastMessage: 'A visita está confirmada para amanhã?',
    timestamp: 'Ontem',
    unreadCount: 0,
    status: 'offline',
    messages: []
  },
  {
    id: '3',
    contactName: 'Carlos Alberto',
    contactAvatar: '',
    lastMessage: 'Obrigado pelas informações.',
    timestamp: '10:05',
    unreadCount: 0,
    status: 'online',
    messages: []
  }
];

'use client';

import { useState, useEffect } from 'react';
import { contactService } from '../services/contact.service';
import { 
  Mail, 
  Phone, 
  Search, 
  Plus, 
  Download,
  Trash2,
  Edit2,
  Eye,
  User,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ContactsListing() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato? Isso não removerá os leads associados, mas eles ficarão órfãos.')) return;
    try {
      await contactService.delete(id);
      toast.success('Contato removido com sucesso');
      loadContacts();
    } catch (error) {
      toast.error('Erro ao remover contato');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Base de Contatos</h1>
          <p className="text-grey-60 mt-1">Todos os clientes e interessados registrados no sistema.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-grey-10 border-grey-15 h-11 px-4 text-white hover:bg-grey-15 hover:border-grey-30 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white font-semibold shadow-lg shadow-purple-60/20 active:scale-95 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-y border-grey-15">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
          <Input 
            placeholder="Pesquisar por nome, email ou telefone..." 
            className="pl-10 bg-grey-10 border-grey-15 h-12 text-sm focus:ring-purple-60/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-auto text-xs text-grey-60 font-bold uppercase tracking-widest">
          {filteredContacts.length} contatos encontrados
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-grey-10 border border-grey-15 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 border-4 border-purple-60 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-grey-40 text-sm animate-pulse">Carregando base de contatos...</p>
            </div>
          ) : filteredContacts.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-grey-08 border-b border-grey-15">
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Nome Completo</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Contato</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Criado em</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-15">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-grey-15/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60 font-bold text-xs">
                          {contact.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none mb-1">{contact.name}</p>
                          <p className="text-[10px] text-grey-50 uppercase tracking-tighter">Pessoa Física</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-grey-60">
                          <Mail className="h-3.5 w-3.5 text-purple-60" />
                          {contact.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-grey-60">
                          <Phone className="h-3.5 w-3.5 text-purple-60" />
                          {contact.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-grey-60">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/contacts/${contact.id}`}>
                          <button className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white hover:bg-purple-60/20 hover:border-purple-60/30 transition-all">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <button className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/30 transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)}
                          className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center gap-6">
              <div className="h-20 w-20 rounded-3xl bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40">
                <User className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Nenhum contato por aqui</h3>
                <p className="text-sm text-grey-60 max-w-xs mx-auto">
                  Sua base de contatos está vazia. Novos contatos serão criados automaticamente quando você receber um lead.
                </p>
              </div>
              <Button className="bg-purple-60 hover:bg-purple-65 text-white h-12 px-8 font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Contato
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

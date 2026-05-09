'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Check, 
  MapPin, 
  Home, 
  DollarSign, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { propertiesService } from '../../properties/services/properties.service';
import { Property } from '../../properties/types/property.types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PropertySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (property: Property) => void;
  selectedId?: string;
}

export function PropertySelectModal({ isOpen, onClose, onSelect, selectedId }: PropertySelectModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      async function loadProperties() {
        try {
          const data = await propertiesService.getAll();
          setProperties(data);
        } catch (error) {
          console.error('Failed to load properties:', error);
        } finally {
          setIsLoading(false);
        }
      }
      loadProperties();
    }
  }, [isOpen]);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-grey-10 border border-grey-15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-grey-15 flex items-center justify-between bg-grey-08">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Selecionar Imóvel</h3>
            <p className="text-grey-40 text-sm">Vincule este lead a um imóvel específico.</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-grey-15 flex items-center justify-center text-white hover:bg-grey-20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-grey-15 bg-grey-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
              <Input 
                placeholder="Pesquisar por título ou bairro..." 
                className="h-12 pl-12 bg-grey-08 border-grey-15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'house', 'apartment', 'condo'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "px-4 h-12 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                    filterType === type 
                      ? "bg-purple-60 border-purple-60 text-white shadow-lg shadow-purple-60/20" 
                      : "bg-grey-08 border-grey-15 text-grey-40 hover:text-white hover:border-grey-20"
                  )}
                >
                  {type === 'all' ? 'Todos' : type === 'house' ? 'Casas' : type === 'apartment' ? 'Aptos' : 'Condos'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-grey-08">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="h-10 w-10 border-4 border-purple-60 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-grey-40 text-sm">Buscando imóveis...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProperties.map((property) => (
                <div 
                  key={property.id}
                  onClick={() => onSelect(property)}
                  className={cn(
                    "group relative bg-grey-10 border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95",
                    selectedId === property.id 
                      ? "border-purple-60 ring-1 ring-purple-60 bg-purple-60/5" 
                      : "border-grey-15 hover:border-grey-20"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-24 rounded-xl overflow-hidden bg-grey-15 flex-shrink-0">
                      {property.images?.[0] ? (
                        <Image 
                          src={property.images[0].startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${property.images[0]}` : property.images[0]} 
                          alt={property.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Home className="h-6 w-6 text-grey-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-60 transition-colors">
                        {property.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-grey-40 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{property.neighborhood}, {property.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-white mt-2">
                        <span className="text-purple-60 text-[10px]">R$</span>
                        {property.price.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    {selectedId === property.id && (
                      <div className="h-6 w-6 rounded-full bg-purple-60 flex items-center justify-center text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="h-16 w-16 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center mb-4 text-grey-40">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-white font-bold">Nenhum imóvel encontrado</p>
              <p className="text-grey-40 text-sm mt-1">Tente ajustar seus filtros de busca.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-grey-10 border-t border-grey-15 flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-grey-15 hover:bg-grey-20 text-white font-bold h-12 px-8"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

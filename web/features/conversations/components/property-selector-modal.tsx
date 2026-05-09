'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Home, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Check,
  Filter,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { propertiesService } from '@/features/properties/services/properties.service';
import { Property } from '@/features/properties/types/property.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PropertySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (properties: Property[]) => void;
}

export function PropertySelectorModal({ isOpen, onClose, onSelect }: PropertySelectorModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

  const getImageUrl = (url: string) => {
    if (!url) return PLACEHOLDER;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadProperties();
    }
  }, [isOpen]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertiesService.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || p.type === filters.type;
    const matchesMinPrice = !filters.minPrice || p.price >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || p.price <= Number(filters.maxPrice);
    
    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedProperties = properties.filter(p => selectedIds.includes(p.id));
    onSelect(selectedProperties);
    setSelectedIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-grey-08 border border-grey-15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-grey-15 flex items-center justify-between bg-grey-10/50">
            <div>
              <h2 className="text-xl font-bold text-white">Selecionar Imóveis</h2>
              <p className="text-sm text-grey-60">Escolha os imóveis que deseja enviar para o cliente</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-grey-15 text-grey-40">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="p-6 bg-grey-08 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-60" />
                <input 
                  type="text"
                  placeholder="Pesquisar por título ou bairro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-grey-10 border border-grey-15 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-60/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="bg-grey-10 border border-grey-15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-60/50 appearance-none min-w-[140px]"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-60"></div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-grey-60">
                <Home className="h-16 w-16 mb-4 opacity-20" />
                <p>Nenhum imóvel encontrado com esses filtros.</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <div 
                  key={property.id}
                  onClick={() => toggleSelection(property.id)}
                  className={cn(
                    "group relative flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                    selectedIds.includes(property.id) 
                      ? "bg-purple-60/10 border-purple-60/50" 
                      : "bg-grey-10/50 border-grey-15 hover:border-grey-30"
                  )}
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-grey-15 flex-shrink-0">
                    <Image 
                      src={getImageUrl(property.images?.[0])} 
                      alt={property.title} 
                      fill
                      unoptimized={property.images?.[0]?.startsWith('/')}
                      className="object-cover" 
                    />
                    {selectedIds.includes(property.id) && (
                      <div className="absolute inset-0 bg-purple-60/40 flex items-center justify-center">
                        <Check className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{property.title}</h3>
                      <p className="text-xs text-grey-60 line-clamp-1">{property.neighborhood}, {property.city}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-grey-60">
                      <div className="flex items-center gap-1 text-[10px]">
                        <BedDouble className="h-3 w-3" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Maximize2 className="h-3 w-3" />
                        {property.area}m²
                      </div>
                    </div>

                    <div className="text-purple-40 font-bold text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-grey-15 bg-grey-10/50 flex items-center justify-between">
            <p className="text-sm text-grey-60">
              {selectedIds.length} imóvel(is) selecionado(s)
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="rounded-xl hover:bg-grey-15">
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className="bg-purple-60 hover:bg-purple-70 text-white px-8 rounded-xl disabled:opacity-50"
              >
                Enviar Selecionados
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

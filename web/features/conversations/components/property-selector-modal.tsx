'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  X, 
  Home, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Check,
  Filter,
  DollarSign,
  Car
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
    type: 'all',
    priceRange: [0, 5000000],
    areaRange: [0, 1000],
    bedrooms: 'all',
    bathrooms: 'all',
    garages: 'all',
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
                         p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || p.type === filters.type;
    const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
    const matchesArea = p.area >= filters.areaRange[0] && p.area <= filters.areaRange[1];
    const matchesBedrooms = filters.bedrooms === 'all' || p.bedrooms >= Number(filters.bedrooms);
    const matchesBathrooms = filters.bathrooms === 'all' || p.bathrooms >= Number(filters.bathrooms);
    const matchesGarages = filters.garages === 'all' || p.garages >= Number(filters.garages);
    
    return matchesSearch && matchesType && matchesPrice && matchesArea && 
           matchesBedrooms && matchesBathrooms && matchesGarages;
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[99999] bg-grey-10 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full min-h-screen flex flex-col bg-grey-10"
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
          <div className="p-8 bg-white/[0.01] space-y-8 border-b border-white/5">
            <div className="flex gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-60 group-focus-within:text-purple-40 transition-colors" />
                <Input 
                  placeholder="Pesquisar por título, bairro ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-grey-08/50 border-white/5 rounded-2xl text-base shadow-inner focus-visible:ring-purple-60/30"
                />
              </div>
              
              <div className="min-w-[200px]">
                <Select value={filters.type} onValueChange={(val) => setFilters({...filters, type: val})}>
                  <SelectTrigger className="h-14 bg-grey-08/50 border-white/5 rounded-2xl">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-grey-10 border-white/10">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                    <SelectItem value="condo">Condomínio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Valor Range */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-grey-40 flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-purple-50" />
                    Preço
                  </Label>
                  <span className="text-[10px] text-purple-40 font-bold">
                    {filters.priceRange[1] >= 5000000 ? 'R$ 5M+' : `Até R$ ${(filters.priceRange[1] / 1000).toFixed(0)}k`}
                  </span>
                </div>
                <Slider 
                  value={filters.priceRange} 
                  min={0} 
                  max={5000000} 
                  step={50000}
                  onValueChange={(val) => setFilters({...filters, priceRange: val})}
                  className="py-4"
                />
              </div>

              {/* Espaço Range */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-grey-40 flex items-center gap-2">
                    <Maximize2 className="h-3 w-3 text-purple-50" />
                    Área
                  </Label>
                  <span className="text-[10px] text-purple-40 font-bold">
                    {filters.areaRange[1] >= 1000 ? '1000m²+' : `${filters.areaRange[1]}m²`}
                  </span>
                </div>
                <Slider 
                  value={filters.areaRange} 
                  min={0} 
                  max={1000} 
                  step={10}
                  onValueChange={(val) => setFilters({...filters, areaRange: val})}
                  className="py-4"
                />
              </div>

              {/* Quartos */}
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-grey-40 flex items-center gap-2 mb-1">
                  <BedDouble className="h-3 w-3 text-purple-50" />
                  Quartos
                </Label>
                <Select value={filters.bedrooms} onValueChange={(val) => setFilters({...filters, bedrooms: val})}>
                  <SelectTrigger className="h-11 bg-grey-08/50 border-white/5 rounded-xl text-xs">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent className="bg-grey-10 border-white/10">
                    <SelectItem value="all">Qualquer</SelectItem>
                    <SelectItem value="1">1+ Quarto</SelectItem>
                    <SelectItem value="2">2+ Quartos</SelectItem>
                    <SelectItem value="3">3+ Quartos</SelectItem>
                    <SelectItem value="4">4+ Quartos</SelectItem>
                    <SelectItem value="5">5+ Quartos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Banheiros */}
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-grey-40 flex items-center gap-2 mb-1">
                  <Bath className="h-3 w-3 text-purple-50" />
                  Banheiros
                </Label>
                <Select value={filters.bathrooms} onValueChange={(val) => setFilters({...filters, bathrooms: val})}>
                  <SelectTrigger className="h-11 bg-grey-08/50 border-white/5 rounded-xl text-xs">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent className="bg-grey-10 border-white/10">
                    <SelectItem value="all">Qualquer</SelectItem>
                    <SelectItem value="1">1+ Banheiro</SelectItem>
                    <SelectItem value="2">2+ Banheiros</SelectItem>
                    <SelectItem value="3">3+ Banheiros</SelectItem>
                    <SelectItem value="4">4+ Banheiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Garagens */}
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-grey-40 flex items-center gap-2 mb-1">
                  <Car className="h-3 w-3 text-purple-50" />
                  Garagens
                </Label>
                <Select value={filters.garages} onValueChange={(val) => setFilters({...filters, garages: val})}>
                  <SelectTrigger className="h-11 bg-grey-08/50 border-white/5 rounded-xl text-xs">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent className="bg-grey-10 border-white/10">
                    <SelectItem value="all">Qualquer</SelectItem>
                    <SelectItem value="0">0+ Vaga</SelectItem>
                    <SelectItem value="1">1+ Vaga</SelectItem>
                    <SelectItem value="2">2+ Vagas</SelectItem>
                    <SelectItem value="3">3+ Vagas</SelectItem>
                    <SelectItem value="4">4+ Vagas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 bg-white/[0.01]">
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
                <motion.div 
                  key={property.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection(property.id)}
                  className={cn(
                    "group relative flex flex-col gap-5 p-6 rounded-3xl border transition-all cursor-pointer",
                    selectedIds.includes(property.id) 
                      ? "bg-purple-60/10 border-purple-60/50 shadow-[0_0_20px_rgba(147,51,234,0.1)]" 
                      : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 shadow-lg">
                    <Image 
                      src={getImageUrl(property.images?.[0])} 
                      alt={property.title} 
                      fill
                      unoptimized={property.images?.[0]?.startsWith('/')}
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                      {property.type}
                    </div>
                    {selectedIds.includes(property.id) && (
                      <div className="absolute inset-0 bg-purple-60/40 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-white rounded-full p-2"
                        >
                          <Check className="h-8 w-8 text-purple-60" />
                        </motion.div>
                      </div>
                    )}
                  </div>
 
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-white text-lg line-clamp-1 tracking-tight">{property.title}</h3>
                      <p className="text-sm text-grey-60 line-clamp-1 font-medium">{property.neighborhood}, {property.city}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/5">
                      <div className="flex items-center gap-2 text-grey-40">
                        <div className="p-1.5 rounded-lg bg-white/5 text-purple-40">
                          <BedDouble className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">{property.bedrooms} Quartos</span>
                      </div>
                      <div className="flex items-center gap-2 text-grey-40">
                        <div className="p-1.5 rounded-lg bg-white/5 text-purple-40">
                          <Bath className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">{property.bathrooms} Banheiros</span>
                      </div>
                      <div className="flex items-center gap-2 text-grey-40">
                        <div className="p-1.5 rounded-lg bg-white/5 text-purple-40">
                          <Car className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">{property.garages} Vagas</span>
                      </div>
                      <div className="flex items-center gap-2 text-grey-40">
                        <div className="p-1.5 rounded-lg bg-white/5 text-purple-40">
                          <Maximize2 className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">{property.area}m²</span>
                      </div>
                    </div>
 
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-purple-40 font-black text-xl tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                      </div>
                      <div className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedIds.includes(property.id)
                          ? "bg-purple-60 border-purple-60"
                          : "border-white/10"
                      )}>
                        {selectedIds.includes(property.id) && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-30 p-8 border-t border-white/5 bg-grey-10/80 backdrop-blur-xl flex items-center justify-between mt-auto">
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
    </AnimatePresence>,
    document.body
  );
}

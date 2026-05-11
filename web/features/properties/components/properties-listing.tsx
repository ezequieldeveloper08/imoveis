'use client';

import { PropertyCard } from './property-card';
import { Property } from '../types/property.types';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { propertiesService } from '../services/properties.service';

export function PropertiesListing() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertiesService.getAll();
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Imóveis</h1>
          <p className="text-grey-60 mt-1">Gerencie seu catálogo de propriedades e anúncios.</p>
        </div>

        <Link href="/admin/properties/new">
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white-pure font-semibold shadow-lg shadow-purple-60/20">
            <Plus className="h-4 w-4 mr-2" />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-y border-grey-15">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
          <Input
            placeholder="Pesquisar por título, bairro ou cidade..."
            className="pl-10 bg-grey-10 border-grey-15 h-12 text-sm focus:ring-purple-60"
          />
        </div>

        <Button variant="outline" className="bg-grey-10 border-grey-15 h-12 px-5 text-white hover:bg-grey-15">
          <Filter className="h-4 w-4 mr-2 text-purple-60" />
          Tipo de Imóvel
        </Button>

        <Button variant="outline" className="bg-grey-10 border-grey-15 h-12 px-5 text-white hover:bg-grey-15">
          <SlidersHorizontal className="h-4 w-4 mr-2 text-purple-60" />
          Preço e Área
        </Button>

        <div className="md:ml-auto flex items-center gap-2">
          <span className="text-xs text-grey-60 font-medium">Ordenar por:</span>
          <select className="bg-grey-10 border border-grey-15 text-white text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-purple-60">
            <option>Mais recentes</option>
            <option>Maior preço</option>
            <option>Menor preço</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-purple-60 mb-4" />
          <p className="text-sm text-grey-60">Carregando seus imóveis...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-8 pb-12">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} isAdmin={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-grey-10 border border-dashed border-grey-15 rounded-3xl">
          <p className="text-grey-60">Nenhum imóvel cadastrado ainda.</p>
          <Link href="/admin/properties/new">
            <Button variant="link" className="text-purple-60 mt-2">
              Cadastre seu primeiro imóvel
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

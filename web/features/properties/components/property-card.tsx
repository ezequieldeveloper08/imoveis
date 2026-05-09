'use client';

import { Property } from '../types/property.types';
import { Bed, Bath, Car, Maximize, MapPin, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
  isAdmin?: boolean;
}

export function PropertyCard({ property, isAdmin = false }: PropertyCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

  const getImageUrl = (url: string) => {
    if (!url) return PLACEHOLDER;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  const detailHref = isAdmin ? `/admin/properties/${property.id}` : `/properties/${property.id}`;

  return (
    <div className="bg-grey-10 border border-grey-15 rounded-2xl overflow-hidden hover:border-purple-60/50 transition-all group relative">
      {/* Image Container */}
      <Link href={detailHref} className="block relative h-56 w-full overflow-hidden">
        <Image
          src={getImageUrl(property.images?.[0])}
          alt={property.title}
          fill
          unoptimized={property.images?.[0]?.startsWith('/')}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-grey-08/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
            {property.listingType === 'sale' ? 'Venda' : 'Aluguel'}
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-60 text-white text-[10px] font-bold uppercase tracking-wider">
            {property.type === 'apartment' ? 'Apto' : 'Casa'}
          </span>
        </div>
      </Link>

      {/* Admin Actions Overlay */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Link 
            href={`/admin/properties/${property.id}/edit`}
            className="h-8 w-8 rounded-lg bg-grey-08/80 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-purple-60 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button className="h-8 w-8 rounded-lg bg-grey-08/80 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <Link href={detailHref} className="block group/title">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white line-clamp-1 group-hover/title:text-purple-60 transition-colors">
              {property.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-grey-60 text-xs mb-4">
            <MapPin className="h-3 w-3 text-purple-60" />
            {property.neighborhood}, {property.city}
          </div>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-3 bg-grey-08 rounded-xl border border-grey-15">
          <div className="flex flex-col items-center gap-1 border-r border-grey-15">
            <Bed className="h-3 w-3 text-grey-40" />
            <span className="text-[10px] text-white font-bold">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-grey-15">
            <Bath className="h-3 w-3 text-grey-40" />
            <span className="text-[10px] text-white font-bold">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-grey-15">
            <Car className="h-3 w-3 text-grey-40" />
            <span className="text-[10px] text-white font-bold">{property.garages}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize className="h-3 w-3 text-grey-40" />
            <span className="text-[10px] text-white font-bold">{property.area}m²</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-grey-60 uppercase font-bold tracking-widest leading-none mb-1">Preço</p>
            <p className="text-xl font-bold text-white tracking-tight">
              {formattedPrice}
              {property.listingType === 'rent' && <span className="text-xs text-grey-60">/mês</span>}
            </p>
          </div>
          <Link href={detailHref}>
            <button className="h-10 px-4 rounded-xl bg-grey-15 border border-grey-20 text-white text-xs font-bold hover:bg-purple-60 hover:border-purple-60 transition-all flex items-center gap-2">
              {isAdmin ? 'Gerenciar' : 'Detalhes'}
              <Eye className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

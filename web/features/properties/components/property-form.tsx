'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  MapPin, 
  Maximize, 
  Bed, 
  Bath, 
  Car, 
  Image as ImageIcon, 
  Check, 
  Upload,
  ArrowRight,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { propertiesService } from '../services/properties.service';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './image-upload';

const propertySchema = z.object({
  title: z.string().min(10, 'Título deve ter pelo menos 10 caracteres'),
  description: z.string().min(50, 'Descrição deve ser mais detalhada'),
  price: z.string().min(1, 'Preço é obrigatório'),
  type: z.string().min(1, 'Selecione o tipo'),
  listingType: z.string().min(1, 'Selecione a modalidade'),
  area: z.string().min(1, 'Área é obrigatória'),
  bedrooms: z.string(),
  bathrooms: z.string(),
  garages: z.string(),
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  state: z.string().min(2, 'UF é obrigatória'),
});

const amenitiesList = [
  'Piscina', 'Churrasqueira', 'Sauna', 'Academia', 'Salão de Festas', 
  'Portaria 24h', 'Ar Condicionado', 'Móveis Planejados', 'Varanda Gourmet',
  'Playground', 'Quadra Poliesportiva', 'Elevador'
];

interface PropertyFormProps {
  id?: string;
}

export function PropertyForm({ id }: PropertyFormProps) {
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const amount = Number(digits) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'house',
      listingType: 'sale',
      bedrooms: '2',
      bathrooms: '2',
      garages: '1'
    }
  });

  useEffect(() => {
    if (id) {
      async function loadProperty() {
        try {
          const property = await propertiesService.getById(id!);
          reset({
            ...property,
            price: formatCurrency((property.price * 100).toString()),
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            garages: property.garages.toString(),
            area: property.area.toString(),
          } as any);
          setSelectedAmenities(property.amenities);
          setUploadedImages(property.images);
        } catch (error) {
          console.error('Failed to load property for editing:', error);
        }
      }
      loadProperty();
    }
  }, [id, reset]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price.replace(/\D/g, '')) / 100,
        area: Number(data.area),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        garages: Number(data.garages),
        amenities: selectedAmenities,
        images: uploadedImages,
      };
      
      if (id) {
        await propertiesService.update(id, payload);
      } else {
        await propertiesService.create(payload);
      }
      router.push('/admin/properties');
    } catch (error) {
      console.error('Failed to save property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {id ? 'Editar Anúncio' : 'Novo Anúncio'}
          </h2>
          <p className="text-grey-60 text-sm mt-1">
            {id ? 'Atualize as informações do seu imóvel.' : 'Preencha todos os detalhes para atrair mais leads.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 w-12 rounded-full transition-all ${
                step >= s ? 'bg-purple-60 shadow-[0_0_10px_rgba(112,59,247,0.4)]' : 'bg-grey-15'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Section 1: Basic Info */}
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-60 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-purple-60/10 flex items-center justify-center border border-purple-60/20">
              <Info className="h-5 w-5 text-purple-60" />
            </div>
            <h3 className="text-lg font-bold text-white">Informações Básicas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input 
                id="title" 
                {...register('title')} 
                placeholder="Ex: Mansão de Luxo com Vista para o Mar em Florianópolis" 
                className="h-14 pl-4"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <textarea 
                id="description" 
                {...register('description')}
                placeholder="Descreva o imóvel, acabamentos, pontos próximos e diferenciais..."
                className="w-full bg-grey-08 border border-grey-15 rounded-xl p-4 text-white placeholder:text-grey-40 focus:ring-2 focus:ring-purple-60 outline-none h-40 transition-all"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Imóvel</Label>
              <Select defaultValue="house" onValueChange={(val) => setValue('type', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="house">Casa de Condomínio</SelectItem>
                  <SelectItem value="apartment">Apartamento Padrão</SelectItem>
                  <SelectItem value="condo">Sobrado</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Valor do Imóvel</Label>
              <div className="relative">
                <Input 
                  id="price" 
                  {...register('price')} 
                  placeholder="R$ 0,00" 
                  className="h-14 pl-4 bg-grey-08 border-grey-15 text-lg font-bold text-white"
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    e.target.value = formatted;
                    setValue('price', formatted);
                  }}
                />
              </div>
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingType">Modalidade</Label>
              <Select defaultValue="sale" onValueChange={(val) => setValue('listingType', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="sale">Venda</SelectItem>
                  <SelectItem value="rent">Locação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 1.5: Location */}
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-60 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-purple-60/10 flex items-center justify-center border border-purple-60/20">
              <MapPin className="h-5 w-5 text-purple-60" />
            </div>
            <h3 className="text-lg font-bold text-white">Localização</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input id="address" {...register('address')} placeholder="Rua, número, complemento..." className="h-14 pl-4 bg-grey-08" />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" {...register('neighborhood')} placeholder="Ex: Itaim Bibi" className="h-14 pl-4 bg-grey-08" />
              {errors.neighborhood && <p className="text-red-400 text-xs mt-1">{errors.neighborhood.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register('city')} placeholder="São Paulo" className="h-14 pl-4 bg-grey-08" />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input id="state" {...register('state')} placeholder="SP" className="h-14 pl-4 bg-grey-08" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Features & Specs */}
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-60 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-purple-60/10 flex items-center justify-center border border-purple-60/20">
              <Maximize className="h-5 w-5 text-purple-60" />
            </div>
            <h3 className="text-lg font-bold text-white">Características e Medidas</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Dormitórios</Label>
              <div className="flex items-center gap-3 bg-grey-08 p-3 rounded-xl border border-grey-15">
                <Bed className="h-4 w-4 text-grey-40" />
                <input {...register('bedrooms')} type="number" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Banheiros</Label>
              <div className="flex items-center gap-3 bg-grey-08 p-3 rounded-xl border border-grey-15">
                <Bath className="h-4 w-4 text-grey-40" />
                <input {...register('bathrooms')} type="number" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vagas</Label>
              <div className="flex items-center gap-3 bg-grey-08 p-3 rounded-xl border border-grey-15">
                <Car className="h-4 w-4 text-grey-40" />
                <input {...register('garages')} type="number" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Área Útil (m²)</Label>
              <div className="flex items-center gap-3 bg-grey-08 p-3 rounded-xl border border-grey-15">
                <Maximize className="h-4 w-4 text-grey-40" />
                <input {...register('area')} placeholder="Ex: 120" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Label className="mb-4 block">Amenidades e Lazer</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {amenitiesList.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium border transition-all",
                    selectedAmenities.includes(item)
                      ? "bg-purple-60/10 border-purple-60 text-white shadow-sm shadow-purple-60/20"
                      : "bg-grey-08 border-grey-15 text-grey-60 hover:border-grey-30 hover:text-white"
                  )}
                >
                  {item}
                  {selectedAmenities.includes(item) && <Check className="h-3 w-3 text-purple-60" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Media */}
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-60 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-purple-60/10 flex items-center justify-center border border-purple-60/20">
              <ImageIcon className="h-5 w-5 text-purple-60" />
            </div>
            <h3 className="text-lg font-bold text-white">Fotos e Vídeos</h3>
          </div>

          <ImageUpload 
            value={uploadedImages} 
            onChange={setUploadedImages} 
            maxFiles={10} 
          />
          
          <p className="mt-6 text-xs text-grey-60 flex items-center gap-2">
            <Info className="h-3 w-3" />
            A primeira imagem será a capa do anúncio. Arraste para reordenar (em breve).
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-grey-15">
          <Button type="button" variant="ghost" className="text-grey-60 hover:text-white hover:bg-transparent">
            Descartar Rascunho
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-purple-60 hover:bg-purple-65 h-14 px-10 text-white font-bold rounded-xl shadow-xl shadow-purple-60/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                Publicar Anúncio
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

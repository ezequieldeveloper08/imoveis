import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BedDouble, Bath, Home as HomeIcon, ChevronLeft, ChevronRight } from "lucide-react"

const properties = [
  {
    id: 1,
    title: "Villa Serenidade à Beira-Mar",
    description: "Uma deslumbrante villa de 4 quartos e 3 banheiros em um bairro suburbano tranquilo... ",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    beds: 4,
    baths: 3,
    type: "Villa",
    price: "R$ 2.750.000",
  },
  {
    id: 2,
    title: "Refúgio Metropolitano",
    description: "Um apartamento chique e totalmente mobiliado de 2 quartos com vista panorâmica da cidade... ",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    beds: 2,
    baths: 2,
    type: "Apartamento",
    price: "R$ 1.850.000",
  },
  {
    id: 3,
    title: "Chalé Retiro Rústico",
    description: "Uma elegante casa de 3 quartos e 2,5 banheiros em um condomínio fechado... ",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 3,
    type: "Casa",
    price: "R$ 1.250.000",
  },
]

export function FeaturedProperties() {
  return (
    <section className="py-24 bg-grey-08" id="properties">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">Imóveis em Destaque</h2>
            </div>
            <p className="text-grey-60 max-w-2xl">
              Explore nossa seleção exclusiva de propriedades em destaque. Cada anúncio oferece um vislumbre de casas excepcionais e investimentos disponíveis através da Estatein. Clique em &apos;Ver Detalhes&apos; para mais informações.
            </p>
          </div>
          <Button variant="outline" className="border-grey-15 bg-grey-10 text-white hover:bg-grey-15">
            Ver Todos os Imóveis
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-grey-10 border border-grey-15 p-6 rounded-2xl space-y-6">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-white text-xl font-semibold">{property.title}</h3>
                  <p className="text-grey-60 text-sm leading-relaxed">
                    {property.description}
                    <button className="text-white hover:underline">Ler Mais</button>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-grey-08 border border-grey-15 px-3 py-1.5 rounded-full text-sm text-white">
                    <BedDouble className="h-4 w-4" /> {property.beds} Quartos
                  </div>
                  <div className="flex items-center gap-2 bg-grey-08 border border-grey-15 px-3 py-1.5 rounded-full text-sm text-white">
                    <Bath className="h-4 w-4" /> {property.baths} Banheiros
                  </div>
                  <div className="flex items-center gap-2 bg-grey-08 border border-grey-15 px-3 py-1.5 rounded-full text-sm text-white">
                    <HomeIcon className="h-4 w-4" /> {property.type}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-1">
                    <span className="text-grey-60 text-xs">Preço</span>
                    <div className="text-white text-xl font-bold">{property.price}</div>
                  </div>
                  <Button className="bg-purple-60 hover:bg-purple-65 text-white px-6">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-grey-15 flex justify-between items-center text-grey-60">
          <div>
            Página <span className="text-white">01</span> de 60
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-grey-15 flex items-center justify-center hover:border-white transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="w-12 h-12 rounded-full border border-grey-15 flex items-center justify-center hover:border-white transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

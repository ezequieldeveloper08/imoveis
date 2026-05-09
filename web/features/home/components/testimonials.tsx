import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    title: "Serviço Excepcional!",
    comment: "Nossa experiência com a Estatein foi fantástica. A dedicação e profissionalismo da equipe tornaram a busca pela nossa casa dos sonhos muito fácil. Altamente recomendado!",
    user: {
      name: "João Silva",
      location: "São Paulo, SP",
      image: "https://i.pravatar.cc/150?u=joao",
    },
    stars: 5,
  },
  {
    id: 2,
    title: "Eficiente e Confiável",
    comment: "A Estatein nos proporcionou um serviço de primeira classe. Eles nos ajudaram a vender nossa propriedade rapidamente e por um ótimo preço. Não poderíamos estar mais felizes.",
    user: {
      name: "Maria Oliveira",
      location: "Rio de Janeiro, RJ",
      image: "https://i.pravatar.cc/150?u=maria",
    },
    stars: 5,
  },
  {
    id: 3,
    title: "Consultores de Confiança",
    comment: "A equipe da Estatein nos guiou durante todo o processo de compra. O conhecimento e comprometimento com nossas necessidades foram impressionantes. Obrigado pelo suporte!",
    user: {
      name: "Pedro Santos",
      location: "Belo Horizonte, MG",
      image: "https://i.pravatar.cc/150?u=pedro",
    },
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-grey-08" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">O que nossos clientes dizem</h2>
            </div>
            <p className="text-grey-60 max-w-2xl">
              Leia as histórias de sucesso e depoimentos sinceros de nossos valiosos clientes. Descubra por que eles escolheram a Estatein para suas necessidades imobiliárias.
            </p>
          </div>
          <Button variant="outline" className="border-grey-15 bg-grey-10 text-white hover:bg-grey-15">
            Ver Todos os Depoimentos
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-grey-10 border border-grey-15 p-10 rounded-2xl space-y-8">
              <div className="flex gap-1">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-white text-xl font-semibold">{testimonial.title}</h3>
                <p className="text-white text-sm leading-relaxed">
                  &quot;{testimonial.comment}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.user.image}
                    alt={testimonial.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.user.name}</div>
                  <div className="text-grey-60 text-sm">{testimonial.user.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-grey-15 flex justify-between items-center text-grey-60">
          <div>
            Página <span className="text-white">01</span> de 10
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

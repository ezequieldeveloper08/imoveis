import { Button } from "@/components/ui/button"
import Image from "next/image"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-grey-08 border-y border-grey-15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl">
              Comece Sua Jornada Imobiliária Hoje
            </h2>
            <p className="text-grey-60 max-w-3xl text-lg">
              O imóvel dos seus sonhos está a apenas um clique de distância. Esteja você procurando um novo lar, um investimento estratégico ou aconselhamento imobiliário especializado, a Estatein está aqui para ajudá-lo em cada etapa do caminho. Dê o primeiro passo em direção aos seus objetivos imobiliários e explore nossas propriedades disponíveis ou entre em contato com nossa equipe para assistência personalizada.
            </p>
          </div>
          <Button className="bg-purple-60 hover:bg-purple-65 text-white h-16 px-10 text-lg rounded-xl whitespace-nowrap">
            Explorar Imóveis
          </Button>
        </div>
      </div>
      
      {/* Abstract pattern background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/assets/Abstract Design 02.svg"
          alt="Padrão Abstrato"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Gradient overlay to match mockup */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-grey-08 via-transparent to-grey-08 opacity-80"></div>
    </section>
  )
}

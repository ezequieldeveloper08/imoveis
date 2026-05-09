"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const stats = [
  { label: "Clientes Satisfeitos", value: "200+" },
  { label: "Imóveis no Catálogo", value: "10k+" },
  { label: "Anos de Experiência", value: "16+" },
]

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-10 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Encontre o Imóvel <br />
              dos Seus Sonhos
            </h1>
            <p className="text-grey-60 text-lg max-w-xl leading-relaxed">
              Sua jornada para encontrar a propriedade perfeita começa aqui. Explore nossos anúncios e encontre a casa que combina com seus sonhos.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-grey-15 bg-grey-10 text-white h-14 px-8 text-lg hover:bg-grey-15">
              Saiba Mais
            </Button>
            <Button className="bg-purple-60 hover:bg-purple-65 text-white h-14 px-8 text-lg">
              Ver Imóveis
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-grey-10 border border-grey-15 p-6 rounded-xl space-y-2">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-grey-60">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-square lg:aspect-auto lg:h-[600px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-grey-15">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
              alt="Edifício Moderno"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute top-40 -left-16 w-40 h-40 bg-grey-08 rounded-full border border-grey-15 flex items-center justify-center p-4 z-20">
            <div className="relative w-full h-full animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[8.5px] fill-white uppercase tracking-[0.15em] font-bold">
                  <textPath xlinkHref="#circlePath">
                    Encontre o Imóvel dos Seus Sonhos •
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-60 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L13 1M13 1H4M13 1V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20">
        <Image
          src="/assets/Abstract Design 02.svg"
          alt="Abstract"
          fill
          className="object-contain object-right-top"
        />
      </div>
    </section>
  )
}

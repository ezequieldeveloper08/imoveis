import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "Como pesquiso imóveis na Estatein?",
    answer: "Aprenda a usar nossas ferramentas de busca intuitivas para encontrar propriedades que correspondam aos seus critérios.",
  },
  {
    id: 2,
    question: "Quais documentos preciso para vender meu imóvel pela Estatein?",
    answer: "Descubra a documentação necessária para listar sua propriedade conosco de forma segura e rápida.",
  },
  {
    id: 3,
    question: "Como posso entrar em contato com um corretor da Estatein?",
    answer: "Descubra as diferentes maneiras de entrar em contato com nossos corretores experientes.",
  },
]

export function FAQ() {
  return (
    <section className="py-24 bg-grey-08" id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">Perguntas Frequentes</h2>
            </div>
            <p className="text-grey-60 max-w-2xl">
              Encontre respostas para as perguntas mais comuns sobre os serviços da Estatein, anúncios de imóveis e o processo imobiliário. Estamos aqui para fornecer clareza e ajudá-lo em cada etapa.
            </p>
          </div>
          <Button variant="outline" className="border-grey-15 bg-grey-10 text-white hover:bg-grey-15">
            Ver Todas as Perguntas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-grey-10 border border-grey-15 p-10 rounded-2xl space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold leading-relaxed">
                  {faq.question}
                </h3>
                <p className="text-grey-60 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
              <Button variant="outline" className="w-fit border-grey-15 bg-grey-10 text-white hover:bg-grey-15 mt-4">
                Ler Mais
              </Button>
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

import { Search, Home, Building2, BarChart3, ArrowUpRight } from "lucide-react"

const features = [
  {
    title: "Encontre Sua Casa dos Sonhos",
    icon: Home,
  },
  {
    title: "Valorize Sua Propriedade",
    icon: Building2,
  },
  {
    title: "Gestão Imobiliária Sem Esforço",
    icon: Search,
  },
  {
    title: "Investimentos Inteligentes e Decisões Precisas",
    icon: BarChart3,
  },
]

export function FeatureGrid() {
  return (
    <section className="py-12 border-y border-grey-15 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-grey-10 border border-grey-15 p-10 rounded-xl hover:bg-grey-15 transition-all cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-grey-30 group-hover:text-white transition-colors">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              
              <div className="space-y-6">
                <div className="w-16 h-16 bg-grey-08 border border-grey-15 rounded-full flex items-center justify-center text-purple-60">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold text-lg leading-snug">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import Image from "next/image"
import { Mail, Send } from "lucide-react"

const footerLinks = [
  {
    title: "Início",
    links: [
      { name: "Seção Hero", href: "#hero" },
      { name: "Recursos", href: "#features" },
      { name: "Imóveis", href: "#properties" },
      { name: "Depoimentos", href: "#testimonials" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Sobre Nós",
    links: [
      { name: "Nossa História", href: "/about" },
      { name: "Nossos Trabalhos", href: "/works" },
      { name: "Como Funciona", href: "/how-it-works" },
      { name: "Nossa Equipe", href: "/team" },
      { name: "Nossos Clientes", href: "/clients" },
    ],
  },
  {
    title: "Imóveis",
    links: [
      { name: "Portfólio", href: "/portfolio" },
      { name: "Categorias", href: "/categories" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { name: "Avaliação Profissional", href: "/services/valuation" },
      { name: "Marketing Estratégico", href: "/services/marketing" },
      { name: "Especialistas em Negociação", href: "/services/negotiation" },
      { name: "Sucesso no Fechamento", href: "/services/closing" },
      { name: "Gestão de Propriedades", href: "/services/management" },
    ],
  },
  {
    title: "Contato",
    links: [
      { name: "Formulário de Contato", href: "/contact" },
      { name: "Nossos Escritórios", href: "/offices" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-grey-08 pt-20 pb-10 border-t border-grey-15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <Image
              src="/assets/logo.svg"
              alt="Logo Estatein"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="relative max-w-md">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-60 h-5 w-5" />
              <input
                type="email"
                placeholder="Seu E-mail"
                className="w-full bg-grey-10 border border-grey-15 rounded-lg py-4 pl-12 pr-16 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-purple-60 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="text-grey-60 font-medium">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white hover:text-purple-60 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-grey-15 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-grey-60">
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">
              Termos e Condições
            </Link>
            <p>© 2024 Estatein. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center hover:bg-grey-15 cursor-pointer transition-colors">
              <span className="sr-only">Facebook</span>
              <i className="fab fa-facebook-f text-white"></i>
            </div>
            <div className="w-10 h-10 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center hover:bg-grey-15 cursor-pointer transition-colors">
              <span className="sr-only">Twitter</span>
              <i className="fab fa-twitter text-white"></i>
            </div>
            <div className="w-10 h-10 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center hover:bg-grey-15 cursor-pointer transition-colors">
              <span className="sr-only">LinkedIn</span>
              <i className="fab fa-linkedin-in text-white"></i>
            </div>
            <div className="w-10 h-10 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center hover:bg-grey-15 cursor-pointer transition-colors">
              <span className="sr-only">YouTube</span>
              <i className="fab fa-youtube text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

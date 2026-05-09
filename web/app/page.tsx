import { Navbar } from "@/shared/components/navbar"
import { Footer } from "@/shared/components/footer"
import { Hero } from "@/features/home/components/hero"
import { FeatureGrid } from "@/features/home/components/feature-grid"
import { FeaturedProperties } from "@/features/home/components/featured-properties"
import { Testimonials } from "@/features/home/components/testimonials"
import { FAQ } from "@/features/home/components/faq"
import { CTASection } from "@/features/home/components/cta-section"
import { X } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-grey-08">
      {/* Top Banner */}
      <div className="bg-grey-10 border-b border-grey-15 py-3 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="text-white">
            ✨ Encontre o imóvel dos seus sonhos com a Estatein{" "}
            <a href="#" className="underline ml-1 hover:text-purple-60 transition-colors">
              Saiba Mais
            </a>
          </p>
        </div>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <Navbar />

      <main className="flex-grow">
        <Hero />
        <FeatureGrid />
        <FeaturedProperties />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

import { Navbar } from "@/shared/components/navbar"
import { Footer } from "@/shared/components/footer"
import { SearchFilters } from "@/features/properties/components/search-filters"
import { PropertyGrid } from "@/features/properties/components/property-grid"
import { ContactForm } from "@/features/properties/components/contact-form"
import { CTASection } from "@/features/home/components/cta-section"

export default function PropertiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-grey-08">
      <Navbar />

      <main className="flex-grow">
        <header className="py-24 border-b border-grey-15 bg-gradient-to-b from-grey-10 to-grey-08">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">Find Your Dream Property</h1>
              <p className="text-grey-60 max-w-4xl text-lg">
                Welcome to Estatein, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey...
              </p>
            </div>
          </div>
        </header>

        <SearchFilters />
        <PropertyGrid />
        <ContactForm />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

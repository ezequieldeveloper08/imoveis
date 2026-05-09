import { Navbar } from "@/shared/components/navbar"
import { Footer } from "@/shared/components/footer"
import { PropertyGallery } from "@/features/properties/components/property-gallery"
import { PropertyInfo } from "@/features/properties/components/property-info"
import { PricingDetails } from "@/features/properties/components/pricing-details"
import { ContactForm } from "@/features/properties/components/contact-form"
import { FAQ } from "@/features/home/components/faq"
import { CTASection } from "@/features/home/components/cta-section"
import { MapPin } from "lucide-react"

export default function PropertyDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-grey-08">
      <Navbar />

      <main className="flex-grow">
        <header className="py-12 bg-grey-08">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white">Seaside Serenity Villa</h1>
              <div className="flex items-center gap-2 text-grey-60 border border-grey-15 bg-grey-10 px-4 py-2 rounded-lg w-fit">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Malibu, California</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-grey-60 text-sm">Price</div>
              <div className="text-white text-3xl font-bold">$1,250,000</div>
            </div>
          </div>
        </header>

        <PropertyGallery />
        <PropertyInfo />
        <ContactForm />
        <PricingDetails />
        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

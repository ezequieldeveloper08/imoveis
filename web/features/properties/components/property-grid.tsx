import { PropertyCard } from "./property-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const properties: any[] = [
  {
    id: "1",
    title: "Seaside Serenity Villa",
    description: "Wake up to the soothing melody of waves. This beachfront villa offers... ",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800"],
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: 250,
    type: "house",
    listingType: "sale",
    price: 1250000,
    neighborhood: "Coastal Escapes",
    city: "Malibu",
    status: "AVAILABLE"
  },
  {
    id: "2",
    title: "Metropolitan Haven",
    description: "Immerse yourself in the energy of the city. This modern apartment in the heart... ",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"],
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    area: 120,
    type: "apartment",
    listingType: "rent",
    price: 6500,
    neighborhood: "Urban Oasis",
    city: "New York",
    status: "AVAILABLE"
  },
  {
    id: "3",
    title: "Rustic Retreat Cottage",
    description: "Find tranquility in the countryside. This charming cottage is nestled amidst rolling hills... ",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"],
    bedrooms: 3,
    bathrooms: 3,
    garages: 2,
    area: 180,
    type: "house",
    listingType: "sale",
    price: 350000,
    neighborhood: "Countryside Charm",
    city: "Austin",
    status: "AVAILABLE"
  },
]

export function PropertyGrid() {
  return (
    <section className="py-24 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-16">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Discover a World of Possibilities</h2>
          </div>
          <p className="text-grey-60 max-w-4xl">
            Our portfolio of properties is as diverse as your dreams. Explore the following categories to find the perfect property that resonates with your vision of home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-grey-15 flex justify-between items-center text-grey-60">
          <div>
            <span className="text-white font-medium">01</span> of 10
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

import { BedDouble, Bath, Maximize, Zap } from "lucide-react"

const amenities = [
  "Expansive oceanfront terrace for outdoor entertaining",
  "Gourmet kitchen with top-of-the-line appliances",
  "Private beach access for morning strolls and sunset views",
  "Master suite with a spa-inspired bathroom and ocean-facing balcony",
  "Private garage and ample storage space",
]

export function PropertyInfo() {
  return (
    <section className="py-12 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
        <div className="bg-grey-10 border border-grey-15 p-12 rounded-2xl space-y-10">
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold">Description</h3>
            <p className="text-grey-60 leading-relaxed text-lg">
              Discover your own piece of paradise with the Seaside Serenity Villa. T. With an open floor plan, breathtaking ocean views from every room, and direct access to a pristine sandy beach, this property is the epitome of coastal living.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-grey-15">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-grey-60">
                <BedDouble className="h-5 w-5" />
                <span className="text-sm">Bedrooms</span>
              </div>
              <div className="text-white text-2xl font-bold">04</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-grey-60">
                <Bath className="h-5 w-5" />
                <span className="text-sm">Bathrooms</span>
              </div>
              <div className="text-white text-2xl font-bold">03</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-grey-60">
                <Maximize className="h-5 w-5" />
                <span className="text-sm">Area</span>
              </div>
              <div className="text-white text-2xl font-bold">2,500 Square Feet</div>
            </div>
          </div>
        </div>

        <div className="bg-grey-10 border border-grey-15 p-12 rounded-2xl space-y-10">
          <h3 className="text-white text-2xl font-bold">Key Features and Amenities</h3>
          <ul className="space-y-6">
            {amenities.map((item, idx) => (
              <li key={idx} className="flex gap-4 p-4 bg-grey-08 border-l-2 border-purple-60 rounded-r-lg group hover:bg-grey-15 transition-colors">
                <Zap className="h-5 w-5 text-purple-60 flex-shrink-0" />
                <span className="text-grey-60 text-sm group-hover:text-white transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

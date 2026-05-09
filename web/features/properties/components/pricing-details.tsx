import { Button } from "@/components/ui/button"

const sections = [
  {
    title: "Additional Fees",
    items: [
      { label: "Property Transfer Tax", value: "$25,000", sub: "Based on the sale price and local regulations" },
      { label: "Legal Fees", value: "$3,000", sub: "Approximate cost for legal services, including title transfer" },
      { label: "Home Inspection", value: "$500", sub: "Recommended for due diligence" },
      { label: "Property Insurance", value: "$1,200", sub: "Annual cost for comprehensive property insurance" },
      { label: "Mortgage Fees", value: "Varies", sub: "If applicable, consult with your lender for specific details" },
    ],
  },
  {
    title: "Monthly Costs",
    items: [
      { label: "Property Taxes", value: "$1,250", sub: "Approximate monthly property tax based on the sale price and local rates" },
      { label: "Homeowners' Association Fee", value: "$300", sub: "Monthly fee for common area maintenance and security" },
    ],
  },
  {
    title: "Total Initial Costs",
    items: [
      { label: "Listing Price", value: "$1,250,000" },
      { label: "Additional Fees", value: "$29,700", sub: "Property transfer tax, legal fees, inspection, insurance" },
      { label: "Down Payment", value: "$250,000", sub: "20%" },
      { label: "Mortgage Amount", value: "$1,000,000", sub: "If applicable" },
    ],
  },
  {
    title: "Monthly Expenses",
    items: [
      { label: "Property Taxes", value: "$1,250" },
      { label: "Homeowners' Association Fee", value: "$300" },
      { label: "Mortgage Payment", value: "Varies", sub: "Based on terms and interest rate" },
      { label: "Property Insurance", value: "$100", sub: "Approximate monthly cost" },
    ],
  },
]

export function PricingDetails() {
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
            <h2 className="text-3xl md:text-5xl font-bold text-white">Comprehensive Pricing Details</h2>
          </div>
          <p className="text-grey-60 max-w-4xl">
            At Estatein, transparency is key. We want you to have a clear understanding of all costs associated with your property investment. Below, we break down the pricing for Seaside Serenity Villa to help you make an informed decision.
          </p>
        </div>

        <div className="bg-grey-10 border border-grey-15 p-12 rounded-2xl">
          <div className="bg-grey-08 border border-grey-15 rounded-xl p-6 mb-12 flex justify-between items-center">
             <span className="text-white font-medium">Note</span>
             <span className="text-grey-60 text-sm italic">The figures provided above are estimates and may vary depending on the property, location, and individual circumstances.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {sections.map((section) => (
              <div key={section.title} className="space-y-8">
                <div className="flex justify-between items-center border-b border-grey-15 pb-4">
                  <h4 className="text-white text-xl font-bold">{section.title}</h4>
                  <Button variant="outline" className="border-grey-15 bg-grey-10 text-white hover:bg-grey-15 h-8 px-4 text-xs">
                    Learn More
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {section.items.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="text-grey-60 text-sm">{item.label}</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-white text-xl font-bold">{item.value}</div>
                        {item.sub && <div className="text-grey-40 text-xs px-2 py-0.5 bg-grey-15 rounded-full">{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

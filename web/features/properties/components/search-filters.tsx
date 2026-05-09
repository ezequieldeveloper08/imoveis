"use client"

import { Search, MapPin, Building2, DollarSign, Maximize, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const filterOptions = [
  { label: "Location", icon: MapPin },
  { label: "Property Type", icon: Building2 },
  { label: "Pricing Range", icon: DollarSign },
  { label: "Property Size", icon: Maximize },
  { label: "Build Year", icon: Calendar },
]

export function SearchFilters() {
  return (
    <section className="py-12 bg-grey-08 relative z-20 -mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-grey-10 border border-grey-15 p-2 rounded-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search For A Property"
                className="w-full bg-transparent border-none py-6 pl-6 pr-12 text-white placeholder:text-grey-40 focus:outline-none text-lg"
              />
            </div>
            <Button className="bg-purple-60 hover:bg-purple-65 text-white h-auto py-4 px-8 rounded-xl flex gap-2 text-lg font-semibold m-2">
              <Search className="h-5 w-5" />
              Find Property
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2 p-2 bg-grey-08 rounded-xl border border-grey-15">
            {filterOptions.map((filter) => (
              <button
                key={filter.label}
                className="flex items-center justify-between gap-3 px-4 py-4 rounded-lg bg-grey-10 border border-grey-15 text-white hover:bg-grey-15 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <filter.icon className="h-5 w-5 text-grey-40 group-hover:text-purple-60 transition-colors" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-grey-40" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

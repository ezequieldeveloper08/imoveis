"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600607687940-4e2a09615d33?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600585154526-990dcea4d4d9?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
]

export function PropertyGallery() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-12 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-grey-10 border border-grey-15 p-12 rounded-2xl space-y-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`relative flex-shrink-0 w-40 aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                  active === idx ? "border-purple-60" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-grey-15">
              <Image src={images[active]} alt="Active" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-grey-15 hidden lg:block">
              <Image src={images[(active + 1) % images.length]} alt="Next" fill className="object-cover" />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-grey-08 border border-grey-15 rounded-full p-2 flex items-center gap-4">
              <button className="w-10 h-10 rounded-full border border-grey-15 flex items-center justify-center hover:bg-grey-15 transition-colors">
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex gap-1">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      active === idx ? "w-8 bg-purple-60" : "w-2 bg-grey-20"
                    }`}
                  />
                ))}
              </div>
              <button className="w-10 h-10 rounded-full border border-grey-15 flex items-center justify-center hover:bg-grey-15 transition-colors">
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

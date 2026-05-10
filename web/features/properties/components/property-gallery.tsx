"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  const [direction, setDirection] = useState(0)

  const handleNext = useCallback(() => {
    setDirection(1)
    setActive((prev) => (prev + 1) % images.length)
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setActive((prev) => (prev - 1 + images.length) % images.length)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <section className="py-12 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-grey-10 border border-grey-15 p-6 md:p-12 rounded-2xl space-y-8 shadow-2xl">
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > active ? 1 : -1)
                  setActive(idx)
                }}
                className={`relative flex-shrink-0 w-32 md:w-44 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all snap-center ${
                  active === idx ? "border-purple-60 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main View */}
          <div className="relative h-[300px] md:h-[600px] rounded-2xl overflow-hidden border border-grey-15 bg-grey-08 group">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <Image 
                  src={images[active]} 
                  alt="Property Image" 
                  fill 
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Navigation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-purple-60 transition-colors pointer-events-auto shadow-xl"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-purple-60 transition-colors pointer-events-auto shadow-xl"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Image Counter Overlay */}
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold font-mono">
              {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>

          {/* Bottom Navigation & Indicator */}
          <div className="flex justify-center">
            <div className="bg-grey-08/80 backdrop-blur-md border border-grey-15 rounded-full p-2 flex items-center gap-4 shadow-lg">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-grey-15 flex items-center justify-center hover:bg-grey-15 transition-all active:scale-90"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex gap-1.5 px-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > active ? 1 : -1)
                      setActive(idx)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active === idx ? "w-10 bg-purple-60" : "w-2 bg-grey-20 hover:bg-grey-30"
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-grey-15 flex items-center justify-center hover:bg-grey-15 transition-all active:scale-90"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

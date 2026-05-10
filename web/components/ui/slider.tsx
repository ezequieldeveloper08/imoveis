"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-grey-15 relative h-1.5 w-full grow overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-purple-60 absolute h-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: value?.length || defaultValue?.length || 1 }).map(
        (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className="border-purple-60 bg-white ring-purple-60/20 block size-4 rounded-full border-2 transition-all outline-none focus-visible:ring-4 disabled:pointer-events-none"
          />
        )
      )}
    </SliderPrimitive.Root>
  )
}

export { Slider }

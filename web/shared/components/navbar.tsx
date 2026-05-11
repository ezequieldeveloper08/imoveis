"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Sobre Nós", href: "/about" },
  { name: "Imóveis", href: "/properties" },
  { name: "Serviços", href: "/services" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-grey-15 bg-grey-08/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.svg"
            alt="Estatein Logo"
            width={120}
            height={40}
            className="h-8 w-auto hidden dark:block"
          />
          <Image
            src="/assets/logo-black.svg"
            alt="Estatein Logo"
            width={120}
            height={40}
            className="h-8 w-auto dark:hidden"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-60",
                pathname === link.href ? "text-white" : "text-grey-60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden sm:flex border-grey-15 bg-grey-10 text-white hover:bg-grey-15 hover:text-white"
          >
            Contato
          </Button>
          {/* Mobile menu could go here */}
        </div>
      </div>
    </nav>
  )
}

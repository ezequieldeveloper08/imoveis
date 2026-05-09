import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutShellProps {
  children: ReactNode;
  imageUrl?: string;
  quote?: string;
  quoteAuthor?: string;
}

export function AuthLayoutShell({
  children,
  imageUrl = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200',
  quote = 'The right home changes everything. Let us help you find yours.',
  quoteAuthor = 'Estatein',
}: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen bg-grey-08 flex">
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <Image src={imageUrl} alt="Property" fill className="object-cover" priority />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-grey-08/90 via-grey-08/60 to-transparent z-10" />

        {/* Abstract decoration */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-60/10 rounded-full blur-3xl z-10" />
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-60/5 rounded-full blur-3xl z-10" />

        {/* Logo */}
        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/assets/logo.svg" alt="Estatein" width={120} height={32} />
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-20 space-y-4">
          <div className="w-10 h-1 bg-purple-60 rounded-full" />
          <blockquote className="text-white text-2xl font-medium leading-relaxed max-w-md">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <cite className="text-grey-60 text-sm not-italic">— {quoteAuthor}</cite>

          <div className="flex gap-4 pt-4">
            {['200+', '10k+', '16+'].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <div className="text-white font-bold text-lg">{stat}</div>
                <div className="text-grey-60 text-xs">
                  {i === 0 ? 'Clients' : i === 1 ? 'Properties' : 'Years'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/">
              <Image src="/assets/logo.svg" alt="Estatein" width={120} height={32} />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

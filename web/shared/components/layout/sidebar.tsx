'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitMerge,
  Target,
  Users,
  Building2,
  MessageSquare,
  Calendar,
  UserCircle,
  Network,
  LogOut,
  Contact,
  ChevronDown,
  Zap,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Pipeline', icon: GitMerge, href: '/admin/pipeline' },
  { name: 'Leads', icon: Target, href: '/admin/leads' },
  { name: 'Contatos', icon: Users, href: '/admin/contacts' },
  { name: 'Imóveis', icon: Building2, href: '/admin/properties' },
  {
    name: 'Conversas',
    icon: MessageSquare,
    href: '/admin/conversations',
    children: [
      { name: 'Chat Principal', icon: MessageSquare, href: '/admin/conversations' },
      { name: 'Configurar WhatsApp', icon: Zap, href: '/admin/whatsapp/onboarding' },
      { name: 'Templates Oficiais', icon: Layout, href: '/admin/whatsapp/templates' },
    ]
  },
  { name: 'Agenda', icon: Calendar, href: '/admin/calendar' },
  { name: 'Usuários', icon: UserCircle, href: '/admin/users' },
  { name: 'Departamentos', icon: Network, href: '/admin/departments' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Conversas']);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-72 bg-grey-08 border-r border-grey-15 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/assets/logo.svg"
            alt="Estatein"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isParentActive = pathname.startsWith(item.href);
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isExpanded = expandedItems.includes(item.name) || isParentActive;

          return (
            <div key={item.name} className="space-y-1">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group",
                    isParentActive
                      ? "bg-grey-10 text-white border border-grey-15"
                      : "text-grey-60 hover:text-white hover:bg-grey-10/50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isParentActive ? "text-purple-60" : "text-grey-40 group-hover:text-grey-30"
                  )} />
                  {item.name}
                  <ChevronDown className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-300",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-grey-10 text-white border border-grey-15 shadow-sm shadow-purple-60/5"
                      : "text-grey-60 hover:text-white hover:bg-grey-10/50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-purple-60" : "text-grey-40 group-hover:text-grey-30"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-60 shadow-[0_0_8px_rgba(112,59,247,0.8)]" />
                  )}
                </Link>
              )}

              {/* Submenu Rendering */}
              {hasChildren && isExpanded && (
                <div className="ml-4 pl-4 border-l border-grey-15 space-y-1 py-1">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.href;
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all group",
                          isChildActive
                            ? "text-white bg-grey-15/50"
                            : "text-grey-50 hover:text-white hover:bg-grey-15/30"
                        )}
                      >
                        <ChildIcon className={cn(
                          "h-4 w-4 transition-colors",
                          isChildActive ? "text-purple-60" : "text-grey-60 group-hover:text-grey-40"
                        )} />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-grey-15">
        <button className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-grey-60 hover:text-red-400 hover:bg-red-500/5 transition-all group">
          <LogOut className="h-5 w-5 text-grey-40 group-hover:text-red-400" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}

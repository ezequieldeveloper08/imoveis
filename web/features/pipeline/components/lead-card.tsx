'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Mail, Phone, Clock, DollarSign, MoreVertical } from 'lucide-react';
import { Lead } from '../types/pipeline.types';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  index: number;
}

export function LeadCard({ lead, index }: LeadCardProps) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-4 mb-3 bg-grey-08 border border-grey-15 rounded-xl transition-all cursor-grab active:cursor-grabbing hover:border-purple-60/50 group",
            snapshot.isDragging && "shadow-2xl shadow-purple-60/20 border-purple-60 rotate-2 scale-105 z-50 bg-grey-10"
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
              lead.priority === 'high' ? "bg-red-500/10 text-red-500" :
              lead.priority === 'medium' ? "bg-orange-500/10 text-orange-500" :
              "bg-blue-500/10 text-blue-500"
            )}>
              {lead.priority === 'high' ? 'Urgente' : lead.priority === 'medium' ? 'Média' : 'Baixa'}
            </div>
            <button className="text-grey-40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mb-1">{lead.name}</h4>
          
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-grey-60">
              <DollarSign className="h-3 w-3 text-purple-60" />
              <span className="font-semibold text-grey-30">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-grey-15/50">
              <div className="flex items-center gap-1.5 text-[10px] text-grey-40">
                <Clock className="h-3 w-3" />
                {lead.lastActivity}
              </div>
              <div className="flex ml-auto gap-2">
                <div className="h-6 w-6 rounded-lg bg-grey-15 flex items-center justify-center hover:bg-purple-60/20 hover:text-purple-60 transition-colors cursor-pointer">
                  <Phone className="h-3 w-3" />
                </div>
                <div className="h-6 w-6 rounded-lg bg-grey-15 flex items-center justify-center hover:bg-purple-60/20 hover:text-purple-60 transition-colors cursor-pointer">
                  <Mail className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

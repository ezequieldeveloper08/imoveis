'use client';

import { Droppable } from '@hello-pangea/dnd';
import { LeadCard } from './lead-card';
import { Lead, LeadStatus } from '../types/pipeline.types';
import { Plus, MoreHorizontal } from 'lucide-react';

interface KanbanColumnProps {
  id: LeadStatus;
  title: string;
  leads: Lead[];
}

export function KanbanColumn({ id, title, leads }: KanbanColumnProps) {
  const totalValue = leads.reduce((acc, lead) => acc + lead.value, 0);

  return (
    <div className="flex flex-col w-[320px] min-w-[320px] bg-grey-10/40 rounded-2xl border border-grey-15 h-full max-h-full">
      <div className="p-4 flex items-center justify-between border-b border-grey-15">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <span className="px-1.5 py-0.5 rounded-md bg-grey-15 text-[10px] text-grey-60 font-bold">
              {leads.length}
            </span>
          </div>
          <p className="text-[10px] text-purple-60 font-bold mt-1">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL',
              maximumFractionDigits: 0 
            }).format(totalValue)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-grey-15 text-grey-60 hover:text-white transition-all">
            <Plus className="h-4 w-4" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-grey-15 text-grey-60 hover:text-white transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver ? 'bg-purple-60/5' : ''
            }`}
          >
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

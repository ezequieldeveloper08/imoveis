'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { Lead, Column, PIPELINE_COLUMNS, LeadStatus } from '../types/pipeline.types';
import { leadsService } from '../../leads/services/leads.service';

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const leads = await leadsService.getAll();
      
      const updatedColumns = PIPELINE_COLUMNS.map(col => ({
        ...col,
        leads: leads.filter((lead: any) => lead.status?.toLowerCase() === col.id.toLowerCase()).map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email || '',
          phone: lead.phone || '',
          value: lead.value || 0,
          status: lead.status as LeadStatus,
          priority: 'medium' as 'medium',
          lastActivity: 'Recent'
        }))
      }));
      
      setColumns(updatedColumns);
    } catch (error) {
      console.error('Failed to load leads for Kanban:', error);
    } finally {
      if (!silent) setIsLoading(false);
      setIsMounted(true);
    }
  };

  useEffect(() => {
    loadLeads();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadLeads(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns.find(col => col.id === source.droppableId);
    const finish = columns.find(col => col.id === destination.droppableId);

    if (!start || !finish) return;

    // Moving within the same column
    if (start === finish) {
      const newLeads = Array.from(start.leads);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);

      const newColumn = {
        ...start,
        leads: newLeads,
      };

      setColumns(columns.map(col => col.id === newColumn.id ? newColumn : col));
      return;
    }

    // Moving to another column
    const startLeads = Array.from(start.leads);
    const [removed] = startLeads.splice(source.index, 1);
    
    // Update lead status
    const updatedLead: Lead = {
      ...removed,
      status: finish.id as LeadStatus
    };

    const finishLeads = Array.from(finish.leads);
    finishLeads.splice(destination.index, 0, updatedLead);

    const newColumns = columns.map(col => {
      if (col.id === start.id) return { ...col, leads: startLeads };
      if (col.id === finish.id) return { ...col, leads: finishLeads };
      return col;
    });

    setColumns(newColumns);

    // Persist to backend
    try {
      await leadsService.update(draggableId, { status: finish.id });
    } catch (error) {
      console.error('Failed to update lead status:', error);
      // Revert if needed (optional for now)
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-60"></div>
      </div>
    );
  }

  // Prevents hydration issues with dnd
  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-[calc(100vh-280px)] overflow-x-auto pb-6 custom-scrollbar">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            leads={column.leads}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

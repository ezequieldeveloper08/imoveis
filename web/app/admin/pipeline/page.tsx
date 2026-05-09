import { KanbanBoard } from '@/features/pipeline/components/kanban-board';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PipelinePage() {
  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pipeline de Leads</h1>
          <p className="text-grey-60 mt-1">Gerencie seu funil de vendas e mova os leads entre os estágios.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-grey-10 p-1 rounded-xl border border-grey-15">
            <Button variant="ghost" size="icon" className="h-9 w-9 bg-grey-15 text-white hover:bg-grey-20 transition-all">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-grey-60 hover:text-white hover:bg-grey-15 transition-all">
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white font-semibold shadow-lg shadow-purple-60/20 active:scale-95 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 py-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-60" />
          <Input 
            placeholder="Filtrar por nome..." 
            className="pl-10 bg-grey-10 border-grey-15 h-10 text-xs focus:ring-purple-60/20"
          />
        </div>
        <Button 
          variant="outline" 
          className="bg-grey-10 border-grey-15 h-10 px-4 text-grey-40 text-xs hover:text-white hover:bg-grey-15 hover:border-grey-30 transition-all"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
        <div className="h-8 w-px bg-grey-15 mx-2" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-grey-60 font-bold uppercase tracking-widest">Responsável:</span>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-7 w-7 rounded-full border-2 border-grey-08 bg-grey-15 flex items-center justify-center text-[10px] font-bold text-white">
                {['JS', 'MP', 'RL'][i-1]}
              </div>
            ))}
            <button className="h-7 w-7 rounded-full border-2 border-grey-08 bg-grey-10 flex items-center justify-center text-grey-60 hover:text-white border-dashed">
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Section */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
}

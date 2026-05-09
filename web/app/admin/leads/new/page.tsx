import { LeadForm } from '@/features/leads/components/lead-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewLeadPage() {
  return (
    <div className="space-y-8">
      <Link href="/admin/leads">
        <Button variant="ghost" className="text-grey-60 hover:text-white p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para leads
        </Button>
      </Link>
      
      <LeadForm />
    </div>
  );
}

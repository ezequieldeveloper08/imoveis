'use client';

import { useParams } from 'next/navigation';
import { LeadForm } from '@/features/leads/components/lead-form';

export default function EditLeadPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="container mx-auto py-8">
      <LeadForm leadId={id} />
    </div>
  );
}

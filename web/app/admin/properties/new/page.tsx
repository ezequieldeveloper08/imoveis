import { PropertyForm } from '@/features/properties/components/property-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  return (
    <div className="space-y-8">
      <Link href="/admin/properties">
        <Button variant="ghost" className="text-grey-60 hover:text-white p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para listagem
        </Button>
      </Link>
      
      <PropertyForm />
    </div>
  );
}

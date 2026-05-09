import { UserForm } from '@/features/users/components/user-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
  return (
    <div className="space-y-8">
      <Link href="/admin/users">
        <Button variant="ghost" className="text-grey-60 hover:text-white p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para equipe
        </Button>
      </Link>
      
      <UserForm />
    </div>
  );
}

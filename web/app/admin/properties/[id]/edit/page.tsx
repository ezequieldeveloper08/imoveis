import { PropertyForm } from "@/features/properties/components/property-form";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-8">
      <PropertyForm id={id} />
    </div>
  );
}

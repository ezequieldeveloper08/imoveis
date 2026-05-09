import { PropertyDetails } from "@/features/properties/components/property-details";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-8">
      <PropertyDetails id={id} />
    </div>
  );
}

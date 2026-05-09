export class Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  listingType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  area: number;
  amenities: string[];
  images: string[];
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Property>) {
    Object.assign(this, partial);
  }
}

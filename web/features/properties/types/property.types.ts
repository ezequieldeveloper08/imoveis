export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'RENTED';
export type PropertyType = 'house' | 'apartment' | 'condo' | 'land';
export type ListingType = 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
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
  createdAt: string;
  updatedAt: string;
}

export const MOCK_PROPERTIES: Property[] = [
];

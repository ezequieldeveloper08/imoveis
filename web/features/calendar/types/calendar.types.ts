export type AppointmentType = 'visit' | 'meeting' | 'call' | 'inspection';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  time: string; // HH:mm
  type: AppointmentType;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  leadName?: string;
  propertyName?: string;
  location?: string;
}

export const MOCK_APPOINTMENTS: Appointment[] = [
];

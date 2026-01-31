
export enum Category {
  GROS_OEUVRE = "Gros œuvre",
  SECOND_OEUVRE = "Second œuvre",
  PLOMBERIE = "Plomberie",
  ELECTRICITE = "Électricité",
  AMENAGEMENT = "Aménagement extérieur",
  BOIS = "Bois / Menuiserie"
}

export enum UserRole {
  PRO = "PRO",
  PARTICULIER = "PARTICULIER",
  ADMIN = "ADMIN"
}

export enum ListingStatus {
  AVAILABLE = "Disponible",
  RESERVED = "Réservé",
  COLLECTED = "Récupéré"
}

export type MaterialType = 'concrete' | 'steel' | 'wood' | 'default';

export interface Material {
  id: string;
  title: string;
  category: Category;
  description: string;
  photoUrl: string;
  galleryUrls?: string[];
  quantity: string;
  price: number;
  proId: string;
  proName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    distanceLabel: string;
  };
  availability: string;
  pickupDeadline: string;
  status: ListingStatus;
  isPremiumOnly: boolean;
  createdAt: number;
  weightEstimatedKg: number;
  materialType?: MaterialType;
  totalStock?: number;
  currentStock?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: number;
  type: 'text' | 'location' | 'system';
  locationData?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  isPremium: boolean;
  siret?: string;
  stats?: {
    totalWasteDivertedKg: number;
    listingsPosted: number;
    itemsCollected: number;
  };
}

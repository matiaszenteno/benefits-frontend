export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  location?: string;
  image_url?: string;
  fullDescription?: string;
  discount?: string;
  validDays?: string[];
  affiliation?: string;
  imageUrl?: string;
  rating?: number;
  validUntil?: string;
  terms?: string;
  howToRedeem?: string;
  contactInfo?: string;
  created_at?: string;
}
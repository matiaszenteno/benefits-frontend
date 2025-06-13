export interface Benefit {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  discount?: string;
  category: string;
  location?: string;
  validDays?: string[];
  provider?: string;
  affiliation?: string;
  imageUrl?: string;
  rating?: number;
  validUntil?: string;
  terms?: string;
  howToRedeem?: string;
  contactInfo?: string;
  created_at?: string;
}
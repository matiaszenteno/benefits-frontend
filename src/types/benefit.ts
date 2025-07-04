export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: string;
  merchant_category?: string;
  merchant_sub_category?: string;
  provider: string;
  location?: string;
  image_url?: string;
  source_url?: string;
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
  color?: string;
  end_date?: string;
  is_active?: boolean;
  is_carousel?: boolean;
  carousel_image_url?: string;
}

export interface PaginatedBenefitsResponse {
  data: Benefit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BenefitsFilter {
  category?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
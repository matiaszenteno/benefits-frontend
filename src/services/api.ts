import axios from 'axios';

const API_URL = 'https://rt2ntcj19l.execute-api.us-east-1.amazonaws.com/prod/benefits';

export interface Benefit {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export const getBenefits = async (): Promise<Benefit[]> => {
  const response = await axios.get<Benefit[]>(API_URL);
  return response.data;
}; 
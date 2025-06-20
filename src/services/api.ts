import { Benefit, PaginatedBenefitsResponse, BenefitsFilter } from '../types/benefit';

const API_URL = 'https://d34if2n2g5.execute-api.us-east-1.amazonaws.com/prod/benefits';
const AI_SEARCH_URL = 'https://d34if2n2g5.execute-api.us-east-1.amazonaws.com/prod/search';

interface FilterParams {
  category?: string;
  location?: string;
  affiliation?: string;
  page?: number;
  limit?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id?: number;
}

// Nueva función con paginación del backend
export const getBenefitsPaginated = async (filters: BenefitsFilter = {}): Promise<PaginatedBenefitsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    if (filters.is_active !== undefined) {
      queryParams.append('is_active', filters.is_active.toString());
    }
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const response = await fetch(`${API_URL}/benefits?${queryParams}`);
    if (!response.ok) throw new Error('Error al obtener beneficios');
    
    const data = await response.json();
    
    // El backend devuelve { data: Benefit[], pagination: {...} }
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Formato de respuesta inválido del servidor');
    }
    
    return {
      data: processBenefits(data.data),
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error al obtener beneficios paginados:', error);
    throw error;
  }
};

// Mantener la función original para compatibilidad (ahora usa la nueva paginación)
export const getFilteredBenefits = async (filters: FilterParams = {}): Promise<Benefit[]> => {
  try {
    const paginatedResponse = await getBenefitsPaginated({
      category: filters.category,
      page: filters.page || 1,
      limit: filters.limit || 36 // Default 36 para prefetch, compatible con nueva estrategia
    });
    
    return paginatedResponse.data;
  } catch (error) {
    console.error('Error en filtros tradicionales:', error);
    throw error;
  }
};

// Para búsqueda AI - solo acepta query de texto
export const searchBenefitsAI = async (query: string): Promise<Benefit[]> => {
  try {
    const response = await fetch(AI_SEARCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (!response.ok) throw new Error('Error en la búsqueda AI');
    
    const result = await response.json();
    
    // La respuesta de la lambda search incluye aiResponse, extraer los beneficios de ahí
    let benefits = result.aiResponse || [];
    
    // Asegurar que siempre trabajemos con un array
    if (!Array.isArray(benefits)) {
      console.warn('AI response is not an array:', benefits);
      benefits = [];
    }
    
    // Procesar los beneficios para asegurar que tengan todos los campos necesarios
    return processBenefits(benefits);
  } catch (error) {
    console.error('Error en búsqueda AI:', error);
    throw error;
  }
};



// Obtener categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/api/categories`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Obtener subcategorías
export const getSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const response = await fetch(`${API_URL}/api/subcategories`);
    if (!response.ok) throw new Error('Error al obtener subcategorías');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    throw error;
  }
};

// Función para procesar los beneficios y asegurar que tengan todos los campos necesarios
const processBenefits = (benefits: any[]): Benefit[] => {
  // Asegurar que benefits sea un array
  if (!Array.isArray(benefits)) {
    console.warn('processBenefits received non-array data:', benefits);
    return [];
  }
  
  return benefits
    .filter(benefit => benefit.is_active !== false) // Solo mostrar beneficios activos
    .map(benefit => ({
      ...benefit,
      id: benefit.id?.toString() || '',
      category: benefit.merchant_category || benefit.category || 'Sin categoría',
      merchant_sub_category: benefit.merchant_sub_category || benefit.sub_category,
      name: benefit.merchant_name || benefit.name || '', // Usar nombre del merchant
      // Mantener compatibilidad con campos existentes
      imageUrl: benefit.image_url || benefit.imageUrl,
      fullDescription: benefit.description,
      // Asegurar que todos los campos requeridos estén presentes
      description: benefit.description || '',
      provider: benefit.provider || '',
    }));
}; 
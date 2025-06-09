export interface Benefit {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  created_at: string;
}

export const mockBenefits: Benefit[] = [
  {
    id: 1,
    name: "Seguro Médico",
    description: "Cobertura médica completa para el empleado y su familia",
    category: "Salud",
    image_url: "https://example.com/seguro-medico.jpg",
    created_at: "2024-04-01"
  },
  {
    id: 2,
    name: "Vale de Despensa",
    description: "Vale mensual para gastos de despensa",
    category: "Finanzas",
    image_url: "https://example.com/vale-despensa.jpg",
    created_at: "2024-04-02"
  },
  {
    id: 3,
    name: "Gimnasio",
    description: "Membresía anual en gimnasio de la ciudad",
    category: "Deporte",
    image_url: "https://example.com/gimnasio.jpg",
    created_at: "2024-04-03"
  },
  {
    id: 4,
    name: "Día de Cumpleaños",
    description: "Día libre en tu cumpleaños",
    category: "Personal",
    image_url: "https://example.com/dia-cumpleanos.jpg",
    created_at: "2024-04-04"
  },
  {
    id: 5,
    name: "Home Office",
    description: "Flexibilidad para trabajar desde casa",
    category: "Trabajo",
    image_url: "https://example.com/home-office.jpg",
    created_at: "2024-04-05"
  }
]; 
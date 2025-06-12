export interface Benefit {
  id: string;
  name: string;
  description: string;
  bank: string;
  category: string;
  url?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  discount?: string;
  terms?: string;
}

export const mockBenefits: Benefit[] = [
  {
    id: "1",
    name: "Seguro Médico",
    description: "Cobertura médica completa para el empleado y su familia",
    bank: "Banco de la ciudad",
    category: "Salud",
    imageUrl: "https://example.com/seguro-medico.jpg",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    discount: "10%",
    terms: "Cobertura médica completa para el empleado y su familia"
  },
  {
    id: "2",
    name: "Vale de Despensa",
    description: "Vale mensual para gastos de despensa",
    bank: "Banco de la ciudad",
    category: "Finanzas",
    url: "https://example.com/vale-despensa",
    imageUrl: "https://example.com/vale-despensa.jpg",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    discount: "5%",
    terms: "Vale mensual para gastos de despensa"
  },
  {
    id: "3",
    name: "Gimnasio",
    description: "Membresía anual en gimnasio de la ciudad",
    bank: "Banco de la ciudad",
    category: "Deporte",
    url: "https://example.com/gimnasio",
    imageUrl: "https://example.com/gimnasio.jpg",
    startDate: "2024-04-01",
    endDate: "2024-12-31",
    discount: "20%",
    terms: "Membresía anual en gimnasio de la ciudad"
  },
  {
    id: "4",
    name: "Día de Cumpleaños",
    description: "Día libre en tu cumpleaños",
    bank: "Banco de la ciudad",
    category: "Personal",
    url: "https://example.com/dia-cumpleanos",
    imageUrl: "https://example.com/dia-cumpleanos.jpg",
    startDate: "2024-04-01",
    endDate: "2024-12-31",
    discount: "100%",
    terms: "Día libre en tu cumpleaños"
  },
  {
    id: "5",
    name: "Home Office",
    description: "Flexibilidad para trabajar desde casa",
    bank: "Banco de la ciudad",
    category: "Trabajo",
    url: "https://example.com/home-office",
    imageUrl: "https://example.com/home-office.jpg",
    startDate: "2024-04-01",
    endDate: "2024-12-31",
    discount: "100%",
    terms: "Flexibilidad para trabajar desde casa"
  }
]; 
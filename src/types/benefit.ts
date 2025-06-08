export interface Benefit {
  id: number;
  name: string;
  description: string;
}

export const mockBenefits: Benefit[] = [
  {
    id: 1,
    name: "Seguro Médico",
    description: "Cobertura médica completa para el empleado y su familia"
  },
  {
    id: 2,
    name: "Vale de Despensa",
    description: "Vale mensual para gastos de despensa"
  },
  {
    id: 3,
    name: "Gimnasio",
    description: "Membresía anual en gimnasio de la ciudad"
  },
  {
    id: 4,
    name: "Día de Cumpleaños",
    description: "Día libre en tu cumpleaños"
  },
  {
    id: 5,
    name: "Home Office",
    description: "Flexibilidad para trabajar desde casa"
  }
]; 
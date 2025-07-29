export interface ITEquipment {
  id: string;
  employeeId: string;
  employeeName: string;
  equipmentType: 'Ordinateur portable' | 'Ordinateur bureau' | 'Téléphone' | 'Tablette' | 'Écran' | 'Clavier' | 'Souris' | 'Autre';
  brand: string;
  model: string;
  specifications: string;
  screenSize?: string; // Pour ordinateurs et écrans
  serialNumber: string;
  condition: 'Neuf' | 'Déjà utilisé' | 'Reconditionné';
  assignedDate: string;
  returnDate?: string;
  status: 'Assigné' | 'Retourné' | 'En maintenance' | 'Perdu/Volé';
  warrantyEndDate?: string; // Date de fin de garantie
  images: string[]; // URLs des images
  dischargeDocument?: string; // URL du PDF de décharge signé
  notes?: string;
  assignedBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EquipmentFormData {
  employeeId: string;
  equipmentType: ITEquipment['equipmentType'];
  brand: string;
  model: string;
  specifications: string;
  screenSize?: string;
  serialNumber: string;
  condition: ITEquipment['condition'];
  assignedDate: string;
  warrantyEndDate?: string;
  images: File[];
  dischargeDocument?: File;
  notes?: string;
  assignedBy: string;
}

// Types d'équipements avec leurs spécifications typiques
export const EQUIPMENT_TYPES = {
  'Ordinateur portable': {
    fields: ['brand', 'model', 'specifications', 'screenSize', 'serialNumber'],
    requiredSpecs: ['Processeur', 'RAM', 'Stockage', 'OS']
  },
  'Ordinateur bureau': {
    fields: ['brand', 'model', 'specifications', 'serialNumber'],
    requiredSpecs: ['Processeur', 'RAM', 'Stockage', 'OS']
  },
  'Téléphone': {
    fields: ['brand', 'model', 'specifications', 'screenSize', 'serialNumber'],
    requiredSpecs: ['OS', 'Stockage', 'Réseau']
  },
  'Tablette': {
    fields: ['brand', 'model', 'specifications', 'screenSize', 'serialNumber'],
    requiredSpecs: ['OS', 'Stockage', 'Connectivité']
  },
  'Écran': {
    fields: ['brand', 'model', 'screenSize', 'serialNumber'],
    requiredSpecs: ['Résolution', 'Type de dalle', 'Connecteurs']
  },
  'Clavier': {
    fields: ['brand', 'model', 'serialNumber'],
    requiredSpecs: ['Type', 'Connectivité']
  },
  'Souris': {
    fields: ['brand', 'model', 'serialNumber'],
    requiredSpecs: ['Type', 'Connectivité']
  },
  'Autre': {
    fields: ['brand', 'model', 'specifications', 'serialNumber'],
    requiredSpecs: []
  }
} as const;

// Marques populaires par type d'équipement
export const POPULAR_BRANDS = {
  'Ordinateur portable': ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Apple', 'MSI'],
  'Ordinateur bureau': ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Custom Build'],
  'Téléphone': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'],
  'Tablette': ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Amazon'],
  'Écran': ['Dell', 'HP', 'ASUS', 'LG', 'Samsung', 'BenQ', 'AOC'],
  'Clavier': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'Cherry'],
  'Souris': ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'SteelSeries'],
  'Autre': ['Divers']
} as const;
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  site: string;
  arrivalDate: string;
  contractStartDate: string;
  contractEndDate?: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Intérim';
  requiredPPE: string;
  plannedTraining: string;
  hrResponsible: string;
  itResponsible: string;
  securityResponsible: string;
  hrTasks: string[];
  itTasks: string[];
  securityTasks: string[];
  additionalComments: string;
  status: 'Préparation' | 'Accueil' | 'Prise de service' | 'Complété';
  createdAt: string;
  completedAt?: string;
}

export interface Responsable {
  id: string;
  name: string;
  role: string;
  department: 'RH' | 'IT' | 'Sécurité';
  email: string;
  phone?: string;
}

export interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  status: 'Non commencé' | 'En cours' | 'Complété' | 'En retard';
  startDate?: string;
  endDate?: string;
  estimatedDuration: number; // en jours
  responsible: string;
  responsibleDepartment: 'RH' | 'IT' | 'Sécurité';
  comments: string;
  mandatory: boolean;
  order: number;
}

export interface EmployeeIntegration {
  employeeId: string;
  steps: IntegrationStep[];
  overallStatus: 'Préparation' | 'En cours' | 'Complété' | 'En retard';
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
}

export interface KPI {
  integrationsThisWeek: number;
  integrationsOverdue: number;
  integrationsCompleted: number;
  averageDuration: number;
}

export interface FilterOptions {
  department: 'Tous' | 'Mine' | 'Services Généraux' | 'Usines' | 'Sécurité' | 'Camp' | 'Finance';
  timeframe: 'Cette semaine' | 'Semaine dernière' | 'Ce mois' | 'Mois dernier';
}

export interface Notification {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  sentAt: string;
  type: 'info' | 'warning' | 'success' | 'error';
  employeeId?: string;
  status: 'sent' | 'pending' | 'failed';
}

// Tâches prédéfinies par département
export const DEPARTMENT_TASKS = {
  RH: [
    'Préparation du contrat de travail',
    'Accueil et présentation de l\'équipe',
    'Visite des installations',
    'Remise des EPI et uniformes',
    'Formation sécurité générale',
    'Présentation des avantages sociaux',
    'Signature des documents administratifs',
    'Planification formation continue'
  ],
  IT: [
    'Création compte utilisateur Active Directory',
    'Attribution adresse email professionnelle',
    'Configuration ordinateur portable/fixe',
    'Installation logiciels métier',
    'Attribution téléphone portable',
    'Configuration accès VPN et serveurs',
    'Formation outils informatiques',
    'Test connectivité sur site'
  ],
  'Sécurité': [
    'Évaluation médicale d\'aptitude',
    'Formation sécurité spécifique au poste',
    'Attribution badge d\'accès sécurisé',
    'Formation premiers secours',
    'Test procédures d\'évacuation',
    'Habilitation équipements spécialisés',
    'Accompagnement terrain supervisé',
    'Évaluation finale sécurité'
  ]
} as const;

// Nouvelles interfaces pour le système de checklist
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  responsible: 'RH' | 'IT' | 'Sécurité';
  mandatory: boolean;
  estimatedDuration: number; // en heures
  order: number;
  category: string;
}

export interface EmployeeChecklistItem {
  id: string;
  employeeId: string;
  checklistItemId: string;
  status: 'Non commencé' | 'En cours' | 'Complété' | 'En retard';
  completedDate?: string;
  completedBy?: string;
  notes?: string;
  actualDuration?: number;
}

// Checklist par défaut pour tous les nouveaux employés
export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // === TÂCHES RH ===
  {
    id: 'rh-001',
    title: 'Accueil et présentation',
    description: 'Accueillir le nouvel employé et présenter l\'équipe',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 2,
    order: 1,
    category: 'Accueil'
  },
  {
    id: 'rh-002',
    title: 'Induction générale',
    description: 'Présentation de l\'entreprise, valeurs, organisation',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 4,
    order: 2,
    category: 'Formation'
  },
  {
    id: 'rh-003',
    title: 'Visite des installations',
    description: 'Tour guidé des installations minières et zones de travail',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 3,
    order: 3,
    category: 'Découverte'
  },
  {
    id: 'rh-004',
    title: 'Remise des EPI',
    description: 'Distribution et ajustement des équipements de protection individuelle',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 1,
    order: 4,
    category: 'Équipement'
  },
  {
    id: 'rh-005',
    title: 'Signature des documents',
    description: 'Contrat, règlement intérieur, charte sécurité',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 1,
    order: 5,
    category: 'Administratif'
  },
  {
    id: 'rh-006',
    title: 'Formation réglementaire',
    description: 'Formation obligatoire sécurité et réglementation minière',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 8,
    order: 6,
    category: 'Formation'
  },
  {
    id: 'rh-007',
    title: 'Présentation des avantages',
    description: 'Explication des avantages sociaux et services aux employés',
    responsible: 'RH',
    mandatory: false,
    estimatedDuration: 1,
    order: 7,
    category: 'Information'
  },
  {
    id: 'rh-008',
    title: 'Plan de formation personnalisé',
    description: 'Établir le plan de formation continue selon le poste',
    responsible: 'RH',
    mandatory: false,
    estimatedDuration: 2,
    order: 8,
    category: 'Développement'
  },

  // === TÂCHES IT ===
  {
    id: 'it-001',
    title: 'Création des comptes utilisateur',
    description: 'Création comptes Active Directory, email, applications métier',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 2,
    order: 1,
    category: 'Comptes'
  },
  {
    id: 'it-002',
    title: 'Attribution équipement informatique',
    description: 'Fourniture ordinateur portable/fixe selon le poste',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 1,
    order: 2,
    category: 'Matériel'
  },
  {
    id: 'it-003',
    title: 'Configuration poste de travail',
    description: 'Installation logiciels métier et configuration système',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 4,
    order: 3,
    category: 'Configuration'
  },
  {
    id: 'it-004',
    title: 'Attribution téléphone/radio',
    description: 'Remise téléphone portable et/ou radio professionnelle',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 1,
    order: 4,
    category: 'Communication'
  },
  {
    id: 'it-005',
    title: 'Formation outils informatiques',
    description: 'Formation sur les logiciels et systèmes utilisés',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 4,
    order: 5,
    category: 'Formation'
  },
  {
    id: 'it-006',
    title: 'Configuration accès réseau',
    description: 'Paramétrage VPN, accès serveurs, permissions sécurisées',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 2,
    order: 6,
    category: 'Sécurité'
  },
  {
    id: 'it-007',
    title: 'Test connectivité terrain',
    description: 'Vérification connexion et fonctionnement sur site de travail',
    responsible: 'IT',
    mandatory: false,
    estimatedDuration: 2,
    order: 7,
    category: 'Validation'
  },
  {
    id: 'it-008',
    title: 'Documentation utilisateur',
    description: 'Remise guides d\'utilisation et procédures informatiques',
    responsible: 'IT',
    mandatory: false,
    estimatedDuration: 1,
    order: 8,
    category: 'Documentation'
  },

  // === TÂCHES SÉCURITÉ ===
  {
    id: 'sec-001',
    title: 'Évaluation médicale',
    description: 'Visite médicale d\'aptitude au poste et dépistages',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 2,
    order: 1,
    category: 'Médical'
  },
  {
    id: 'sec-002',
    title: 'Formation sécurité spécifique',
    description: 'Formation sécurité selon le poste et département',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 8,
    order: 2,
    category: 'Formation'
  },
  {
    id: 'sec-003',
    title: 'Attribution badge d\'accès',
    description: 'Création et remise badge sécurisé avec niveaux d\'accès',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 1,
    order: 3,
    category: 'Accès'
  },
  {
    id: 'sec-004',
    title: 'Formation premiers secours',
    description: 'Formation gestes de premiers secours en milieu minier',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 8,
    order: 4,
    category: 'Secours'
  },
  {
    id: 'sec-005',
    title: 'Test d\'évacuation',
    description: 'Simulation procédures d\'évacuation d\'urgence',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 2,
    order: 5,
    category: 'Urgence'
  },
  {
    id: 'sec-006',
    title: 'Habilitation équipements',
    description: 'Certification utilisation équipements spécialisés',
    responsible: 'Sécurité',
    mandatory: false,
    estimatedDuration: 8,
    order: 6,
    category: 'Certification'
  },
  {
    id: 'sec-007',
    title: 'Accompagnement terrain',
    description: 'Première sortie accompagnée sur site avec superviseur',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 8,
    order: 7,
    category: 'Pratique'
  },
  {
    id: 'sec-008',
    title: 'Évaluation finale sécurité',
    description: 'Test final des connaissances et validation sécurité',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 2,
    order: 8,
    category: 'Validation'
  }
];
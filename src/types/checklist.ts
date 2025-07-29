export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  responsible: 'RH' | 'IT' | 'Sécurité';
  mandatory: boolean;
  estimatedDuration: number; // en heures
  order: number;
}

export interface EmployeeChecklistItem {
  id: string;
  employeeId: string;
  checklistItemId: string;
  status: 'Non commencé' | 'En cours' | 'Complété';
  completedDate?: string;
  completedBy?: string;
  notes?: string;
  actualDuration?: number;
}

export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Tâches RH
  {
    id: 'rh-001',
    title: 'Accueil et présentation',
    description: 'Accueillir le nouvel employé et présenter l\'équipe',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 1,
    order: 1
  },
  {
    id: 'rh-002',
    title: 'Induction générale',
    description: 'Présentation de l\'entreprise, valeurs, organisation',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 2,
    order: 2
  },
  {
    id: 'rh-003',
    title: 'Visite des locaux',
    description: 'Tour guidé des installations et zones de travail',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 1.5,
    order: 3
  },
  {
    id: 'rh-004',
    title: 'Remise des EPI',
    description: 'Distribution et ajustement des équipements de protection',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 0.5,
    order: 4
  },
  {
    id: 'rh-005',
    title: 'Signature des documents',
    description: 'Contrat, règlement intérieur, charte sécurité',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 0.5,
    order: 5
  },
  {
    id: 'rh-006',
    title: 'Formation réglementaire',
    description: 'Formation obligatoire sécurité et réglementation minière',
    responsible: 'RH',
    mandatory: true,
    estimatedDuration: 4,
    order: 6
  },
  {
    id: 'rh-007',
    title: 'Présentation des avantages',
    description: 'Explication des avantages sociaux et services',
    responsible: 'RH',
    mandatory: false,
    estimatedDuration: 0.5,
    order: 7
  },
  {
    id: 'rh-008',
    title: 'Planification formation continue',
    description: 'Établir le plan de formation personnalisé',
    responsible: 'RH',
    mandatory: false,
    estimatedDuration: 1,
    order: 8
  },

  // Tâches IT
  {
    id: 'it-001',
    title: 'Création des comptes utilisateur',
    description: 'Création comptes Active Directory, email, applications',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 1,
    order: 1
  },
  {
    id: 'it-002',
    title: 'Attribution équipement informatique',
    description: 'Fourniture ordinateur portable/fixe selon le poste',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 0.5,
    order: 2
  },
  {
    id: 'it-003',
    title: 'Configuration poste de travail',
    description: 'Installation logiciels métier et configuration',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 2,
    order: 3
  },
  {
    id: 'it-004',
    title: 'Attribution téléphone/radio',
    description: 'Remise téléphone portable et/ou radio professionnelle',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 0.5,
    order: 4
  },
  {
    id: 'it-005',
    title: 'Formation outils informatiques',
    description: 'Formation sur les logiciels et systèmes utilisés',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 2,
    order: 5
  },
  {
    id: 'it-006',
    title: 'Configuration accès réseau',
    description: 'Paramétrage VPN, accès serveurs, permissions',
    responsible: 'IT',
    mandatory: true,
    estimatedDuration: 1,
    order: 6
  },
  {
    id: 'it-007',
    title: 'Test connectivité terrain',
    description: 'Vérification connexion sur site de travail',
    responsible: 'IT',
    mandatory: false,
    estimatedDuration: 1,
    order: 7
  },
  {
    id: 'it-008',
    title: 'Documentation utilisateur',
    description: 'Remise guides et procédures informatiques',
    responsible: 'IT',
    mandatory: false,
    estimatedDuration: 0.5,
    order: 8
  },

  // Tâches Sécurité
  {
    id: 'sec-001',
    title: 'Évaluation médicale',
    description: 'Visite médicale d\'aptitude au poste',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 1,
    order: 1
  },
  {
    id: 'sec-002',
    title: 'Formation sécurité spécifique',
    description: 'Formation sécurité selon le poste et département',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 4,
    order: 2
  },
  {
    id: 'sec-003',
    title: 'Attribution badge d\'accès',
    description: 'Création et remise badge sécurisé',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 0.5,
    order: 3
  },
  {
    id: 'sec-004',
    title: 'Formation premiers secours',
    description: 'Formation gestes de premiers secours en milieu minier',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 8,
    order: 4
  },
  {
    id: 'sec-005',
    title: 'Test d\'évacuation',
    description: 'Simulation procédures d\'évacuation d\'urgence',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 1,
    order: 5
  },
  {
    id: 'sec-006',
    title: 'Habilitation équipements',
    description: 'Certification utilisation équipements spécialisés',
    responsible: 'Sécurité',
    mandatory: false,
    estimatedDuration: 4,
    order: 6
  },
  {
    id: 'sec-007',
    title: 'Accompagnement terrain',
    description: 'Première sortie accompagnée sur site',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 4,
    order: 7
  },
  {
    id: 'sec-008',
    title: 'Évaluation finale sécurité',
    description: 'Test final des connaissances sécurité',
    responsible: 'Sécurité',
    mandatory: true,
    estimatedDuration: 1,
    order: 8
  }
];
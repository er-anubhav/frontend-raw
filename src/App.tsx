import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './hooks/useAppSelector';
import { setEmployees } from './features/employees/employeeSlice';
import { setResponsables } from './features/responsables/responsableSlice';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import NewEmployeePage from './pages/NewEmployeePage';
import SuiviPage from './pages/SuiviPage';
import NotificationsPage from './pages/NotificationsPage';
import ResponsablesPage from './pages/ResponsablesPage';
import PlanningPage from './pages/PlanningPage';
import ChecklistsPage from './pages/ChecklistsPage';
import ITEquipmentPage from './pages/ITEquipmentPage';
import { Employee, Responsable } from './types';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector((state) => state.ui);

  // Initialize sample data
  useEffect(() => {
    const sampleEmployees: Employee[] = [
      {
        id: '1',
        firstName: 'Alexandre',
        lastName: 'Tremblay',
        position: 'Opérateur de foreuse',
        department: 'Mine',
        site: 'Mine Nord',
        arrivalDate: '2025-08-15',
        contractStartDate: '2025-08-15',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, gants anti-vibration',
        plannedTraining: 'Formation sécurité minière, utilisation foreuse hydraulique',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: 'Expérience préalable en forage',
        status: 'Prise de service',
        createdAt: '2025-08-10T08:00:00Z'
      },
      {
        id: '2',
        firstName: 'Sophie',
        lastName: 'Bergeron',
        position: 'Superviseure production',
        department: 'Usines',
        site: 'Usine de traitement',
        arrivalDate: '2025-08-22',
        contractStartDate: '2025-08-22',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, lunettes protection',
        plannedTraining: 'Leadership sécuritaire, procédures production',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: '10 ans expérience supervision',
        status: 'Complété',
        createdAt: '2025-08-15T08:00:00Z',
        completedAt: '2025-08-29T17:00:00Z'
      },
      {
        id: '3',
        firstName: 'Marc',
        lastName: 'Gagnon',
        position: 'Électricien industriel',
        department: 'Services Généraux',
        site: 'Mine Nord',
        arrivalDate: '2025-09-05',
        contractStartDate: '2025-09-05',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures isolantes, gants électricien',
        plannedTraining: 'Sécurité électrique, systèmes industriels',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation'],
        itTasks: ['Création compte utilisateur'],
        securityTasks: ['Évaluation médicale'],
        additionalComments: 'Certification électricien industriel',
        status: 'Accueil',
        createdAt: '2025-08-30T08:00:00Z'
      },
      {
        id: '4',
        firstName: 'Julie',
        lastName: 'Lavoie',
        position: 'Contrôleuse qualité',
        department: 'Usines',
        site: 'Laboratoire',
        arrivalDate: '2025-09-12',
        contractStartDate: '2025-09-12',
        contractEndDate: '2026-03-12',
        contractType: 'CDD',
        requiredPPE: 'Blouse laboratoire, lunettes sécurité, gants nitrile',
        plannedTraining: 'Procédures qualité, analyses chimiques',
        hrResponsible: 'Sophie Bernard',
        itResponsible: 'Thomas Durand',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: [],
        itTasks: [],
        securityTasks: [],
        additionalComments: 'Diplôme chimie analytique',
        status: 'Préparation',
        createdAt: '2025-09-05T08:00:00Z'
      },
      {
        id: '5',
        firstName: 'David',
        lastName: 'Roy',
        position: 'Opérateur de concasseur',
        department: 'Mine',
        site: 'Mine Sud',
        arrivalDate: '2025-09-20',
        contractStartDate: '2025-09-20',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, bouchons oreilles',
        plannedTraining: 'Opération concasseur, maintenance préventive',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: [],
        itTasks: [],
        securityTasks: [],
        additionalComments: 'Formation technique complétée',
        status: 'Complété',
        createdAt: '2025-09-10T08:00:00Z',
        completedAt: '2025-09-27T17:00:00Z'
      },
      {
        id: '6',
        firstName: 'Émilie',
        lastName: 'Côté',
        position: 'Ingénieure géologue',
        department: 'Mine',
        site: 'Bureau Principal',
        arrivalDate: '2025-10-01',
        contractStartDate: '2025-10-01',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, veste haute visibilité',
        plannedTraining: 'Géologie minière, logiciels spécialisés',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: 'Maîtrise en géologie',
        status: 'Préparation',
        createdAt: '2025-09-25T08:00:00Z'
      },
      {
        id: '7',
        firstName: 'François',
        lastName: 'Moreau',
        position: 'Mécanicien d\'équipement lourd',
        department: 'Services Généraux',
        site: 'Atelier Central',
        arrivalDate: '2025-10-08',
        contractStartDate: '2025-10-08',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, combinaison de travail',
        plannedTraining: 'Maintenance équipements miniers, hydraulique',
        hrResponsible: 'Sophie Bernard',
        itResponsible: 'Thomas Durand',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation'],
        itTasks: ['Création compte utilisateur'],
        securityTasks: ['Évaluation médicale'],
        additionalComments: '15 ans expérience mécanique lourde',
        status: 'Accueil',
        createdAt: '2025-10-01T08:00:00Z'
      },
      {
        id: '8',
        firstName: 'Isabelle',
        lastName: 'Bouchard',
        position: 'Comptable senior',
        department: 'Finance',
        site: 'Bureau Principal',
        arrivalDate: '2025-10-15',
        contractStartDate: '2025-10-15',
        contractType: 'CDI',
        requiredPPE: 'Aucun EPI spécifique',
        plannedTraining: 'Systèmes comptables, procédures financières',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Formation sécurité générale'],
        additionalComments: 'CPA avec 8 ans expérience',
        status: 'Prise de service',
        createdAt: '2025-10-08T08:00:00Z'
      },
      {
        id: '9',
        firstName: 'Patrick',
        lastName: 'Simard',
        position: 'Opérateur de chargeuse',
        department: 'Mine',
        site: 'Mine Nord',
        arrivalDate: '2025-11-01',
        contractStartDate: '2025-11-01',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, gants de travail',
        plannedTraining: 'Opération chargeuse, sécurité minière',
        hrResponsible: 'Sophie Bernard',
        itResponsible: 'Thomas Durand',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation'],
        itTasks: ['Création compte utilisateur'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: 'Permis classe 3 avec endorsement',
        status: 'Préparation',
        createdAt: '2025-10-25T08:00:00Z'
      },
      {
        id: '10',
        firstName: 'Nathalie',
        lastName: 'Pelletier',
        position: 'Technicienne en environnement',
        department: 'Sécurité',
        site: 'Site Central',
        arrivalDate: '2025-11-12',
        contractStartDate: '2025-11-12',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, équipement de mesure',
        plannedTraining: 'Réglementation environnementale, échantillonnage',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: 'Diplôme en sciences environnementales',
        status: 'Accueil',
        createdAt: '2025-11-05T08:00:00Z'
      },
      {
        id: '11',
        firstName: 'Martin',
        lastName: 'Leblanc',
        position: 'Superviseur de quart',
        department: 'Usines',
        site: 'Usine de traitement',
        arrivalDate: '2025-11-25',
        contractStartDate: '2025-11-25',
        contractType: 'CDI',
        requiredPPE: 'Casque, chaussures de sécurité, radio portable',
        plannedTraining: 'Leadership opérationnel, gestion d\'équipe',
        hrResponsible: 'Sophie Bernard',
        itResponsible: 'Thomas Durand',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Évaluation médicale', 'Formation sécurité'],
        additionalComments: '12 ans expérience supervision industrielle',
        status: 'Prise de service',
        createdAt: '2025-11-18T08:00:00Z'
      },
      {
        id: '12',
        firstName: 'Caroline',
        lastName: 'Dufour',
        position: 'Analyste de laboratoire',
        department: 'Usines',
        site: 'Laboratoire',
        arrivalDate: '2025-12-05',
        contractStartDate: '2025-12-05',
        contractType: 'CDI',
        requiredPPE: 'Blouse laboratoire, lunettes sécurité, gants nitrile',
        plannedTraining: 'Analyses minéralogiques, contrôle qualité',
        hrResponsible: 'Marie Dubois',
        itResponsible: 'Jean Martin',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation'],
        itTasks: ['Création compte utilisateur'],
        securityTasks: ['Évaluation médicale'],
        additionalComments: 'Baccalauréat en chimie analytique',
        status: 'Préparation',
        createdAt: '2025-11-28T08:00:00Z'
      },
      {
        id: '13',
        firstName: 'Stéphane',
        lastName: 'Gauthier',
        position: 'Technicien en informatique',
        department: 'Services Généraux',
        site: 'Bureau Principal',
        arrivalDate: '2025-12-15',
        contractStartDate: '2025-12-15',
        contractType: 'CDI',
        requiredPPE: 'Aucun EPI spécifique',
        plannedTraining: 'Systèmes informatiques miniers, support technique',
        hrResponsible: 'Sophie Bernard',
        itResponsible: 'Thomas Durand',
        securityResponsible: 'Pierre Lefebvre',
        hrTasks: ['Accueil et présentation', 'Induction générale'],
        itTasks: ['Création compte utilisateur', 'Attribution équipement'],
        securityTasks: ['Formation sécurité générale'],
        additionalComments: 'DEC en informatique, certifications réseau',
        status: 'Préparation',
        createdAt: '2025-12-08T08:00:00Z'
      }
    ];

    const sampleResponsables: Responsable[] = [
      {
        id: '1',
        name: 'Marie Dubois',
        role: 'Responsable RH',
        department: 'RH',
        email: 'marie.dubois@mine.com',
        phone: '+33 1 23 45 67 89'
      },
      {
        id: '2',
        name: 'Jean Martin',
        role: 'Administrateur Système',
        department: 'IT',
        email: 'jean.martin@mine.com',
        phone: '+33 1 23 45 67 90'
      },
      {
        id: '3',
        name: 'Pierre Lefebvre',
        role: 'Responsable Sécurité',
        department: 'Sécurité',
        email: 'pierre.lefebvre@mine.com',
        phone: '+33 1 23 45 67 91'
      },
      {
        id: '4',
        name: 'Sophie Bernard',
        role: 'Assistante RH',
        department: 'RH',
        email: 'sophie.bernard@mine.com',
        phone: '+33 1 23 45 67 92'
      },
      {
        id: '5',
        name: 'Thomas Durand',
        role: 'Technicien IT',
        department: 'IT',
        email: 'thomas.durand@mine.com',
        phone: '+33 1 23 45 67 93'
      }
    ];

    dispatch(setEmployees(sampleEmployees));
    dispatch(setResponsables(sampleResponsables));
  }, [dispatch]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-onboarding':
        return <NewEmployeePage />;
      case 'suivi':
        return <SuiviPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'responsables':
        return <ResponsablesPage />;
      case 'planning':
        return <PlanningPage employees={[]} />;
      case 'checklists':
        return <ChecklistsPage />;
      case 'equipment':
        return <ITEquipmentPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default App;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, AlertCircle, User, Calendar, MessageSquare, Edit3 } from 'lucide-react';
import { Employee, IntegrationStep } from '../types';

interface IntegrationFlowProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStep: (stepId: string, updates: Partial<IntegrationStep>) => void;
}

const IntegrationFlow: React.FC<IntegrationFlowProps> = ({ employee, isOpen, onClose, onUpdateStep }) => {
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editComments, setEditComments] = useState('');

  // Données d'exemple des étapes d'intégration
  const integrationSteps: IntegrationStep[] = [
    {
      id: 'step-1',
      title: 'Préparation du contrat',
      description: 'Préparation et validation du contrat de travail',
      status: 'Complété',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      estimatedDuration: 2,
      responsible: 'Marie Dubois',
      responsibleDepartment: 'RH',
      comments: 'Contrat signé et validé par la direction',
      mandatory: true,
      order: 1
    },
    {
      id: 'step-2',
      title: 'Accueil et présentation',
      description: 'Accueil du nouvel employé et présentation de l\'équipe',
      status: 'Complété',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      estimatedDuration: 1,
      responsible: 'Marie Dubois',
      responsibleDepartment: 'RH',
      comments: 'Accueil chaleureux, bonne intégration dans l\'équipe',
      mandatory: true,
      order: 2
    },
    {
      id: 'step-3',
      title: 'Configuration IT',
      description: 'Création des comptes et configuration du poste de travail',
      status: 'En cours',
      startDate: '2024-01-16',
      estimatedDuration: 2,
      responsible: 'Jean Martin',
      responsibleDepartment: 'IT',
      comments: 'Comptes créés, installation des logiciels en cours',
      mandatory: true,
      order: 3
    },
    {
      id: 'step-4',
      title: 'Formation sécurité',
      description: 'Formation obligatoire aux procédures de sécurité minière',
      status: 'Non commencé',
      estimatedDuration: 4,
      responsible: 'Pierre Lefebvre',
      responsibleDepartment: 'Sécurité',
      comments: 'Planifiée pour la semaine prochaine',
      mandatory: true,
      order: 4
    },
    {
      id: 'step-5',
      title: 'Évaluation finale',
      description: 'Évaluation des compétences et validation de l\'intégration',
      status: 'Non commencé',
      estimatedDuration: 1,
      responsible: 'Marie Dubois',
      responsibleDepartment: 'RH',
      comments: '',
      mandatory: true,
      order: 5
    }
  ];

  const getStatusIcon = (status: IntegrationStep['status']) => {
    switch (status) {
      case 'Non commencé': return <Clock className="w-5 h-5 text-slate-400" />;
      case 'En cours': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'Complété': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'En retard': return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: IntegrationStep['status']) => {
    switch (status) {
      case 'Non commencé': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'En cours': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Complété': return 'bg-green-100 text-green-800 border-green-200';
      case 'En retard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getDepartmentColor = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return 'bg-blue-100 text-blue-800';
      case 'IT': return 'bg-purple-100 text-purple-800';
      case 'Sécurité': return 'bg-red-100 text-red-800';
    }
  };

  const handleEditComments = (stepId: string, currentComments: string) => {
    setEditingStep(stepId);
    setEditComments(currentComments);
  };

  const handleSaveComments = (stepId: string) => {
    onUpdateStep(stepId, { comments: editComments });
    setEditingStep(null);
    setEditComments('');
  };

  const handleStatusChange = (stepId: string, newStatus: IntegrationStep['status']) => {
    const updates: Partial<IntegrationStep> = { status: newStatus };
    if (newStatus === 'Complété' && !integrationSteps.find(s => s.id === stepId)?.endDate) {
      updates.endDate = new Date().toISOString().split('T')[0];
    }
    onUpdateStep(stepId, updates);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Flow d'intégration
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {employee.firstName} {employee.lastName} - {employee.position}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Employee Info */}
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Département:</span>
                  <span className="ml-2 font-medium">{employee.department}</span>
                </div>
                <div>
                  <span className="text-slate-500">Site:</span>
                  <span className="ml-2 font-medium">{employee.site}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date d'arrivée:</span>
                  <span className="ml-2 font-medium">
                    {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Statut global:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status as any)}`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Étapes d'intégration</h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-6">
                  {integrationSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-start space-x-4"
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-200 rounded-full">
                        {getStatusIcon(step.status)}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-slate-900">{step.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {step.mandatory && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Obligatoire
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDepartmentColor(step.responsibleDepartment)}`}>
                              {step.responsibleDepartment}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Responsable:</span>
                            <span className="font-medium">{step.responsible}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Durée:</span>
                            <span className="font-medium">{step.estimatedDuration} jour{step.estimatedDuration > 1 ? 's' : ''}</span>
                          </div>
                          
                          {step.startDate && (
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-600">Début:</span>
                              <span className="font-medium">
                                {new Date(step.startDate).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          )}
                          
                          {step.endDate && (
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-600">Fin:</span>
                              <span className="font-medium">
                                {new Date(step.endDate).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Status selector */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Statut:
                          </label>
                          <select
                            value={step.status}
                            onChange={(e) => handleStatusChange(step.id, e.target.value as IntegrationStep['status'])}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          >
                            <option value="Non commencé">Non commencé</option>
                            <option value="En cours">En cours</option>
                            <option value="Complété">Complété</option>
                            <option value="En retard">En retard</option>
                          </select>
                        </div>
                        
                        {/* Comments */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                              Commentaires:
                            </label>
                            {editingStep !== step.id && (
                              <button
                                onClick={() => handleEditComments(step.id, step.comments)}
                                className="text-slate-500 hover:text-slate-700 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          {editingStep === step.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editComments}
                                onChange={(e) => setEditComments(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                rows={3}
                                placeholder="Ajouter un commentaire..."
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSaveComments(step.id)}
                                  className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                  Sauvegarder
                                </button>
                                <button
                                  onClick={() => setEditingStep(null)}
                                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-slate-600">
                                {step.comments || 'Aucun commentaire'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IntegrationFlow;
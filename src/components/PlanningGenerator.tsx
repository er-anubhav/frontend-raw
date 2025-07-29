import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Download, 
  Filter, 
  X, 
  FileText,
  Users,
  Monitor,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Employee, DEFAULT_CHECKLIST_ITEMS } from '../types';

interface PlanningGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

interface PlanningTask {
  id: string;
  employeeId: string;
  employeeName: string;
  taskTitle: string;
  responsible: 'RH' | 'IT' | 'Sécurité';
  estimatedDuration: number;
  startDate: Date;
  endDate: Date;
  status: 'Planifié' | 'En cours' | 'Complété' | 'En retard';
  priority: 'Haute' | 'Moyenne' | 'Basse';
  mandatory: boolean;
}

const PlanningGenerator: React.FC<PlanningGeneratorProps> = ({ 
  isOpen, 
  onClose, 
  employees 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<'Tous' | 'RH' | 'IT' | 'Sécurité'>('Tous');
  const [selectedWeek, setSelectedWeek] = useState<string>(getWeekString(new Date()));
  const [viewMode, setViewMode] = useState<'semaine' | 'mois'>('semaine');

  // Générer le planning automatiquement
  const generatePlanning = (): PlanningTask[] => {
    const planning: PlanningTask[] = [];
    const startOfWeek = getStartOfWeek(getDateFromWeekString(selectedWeek));

    employees.forEach(employee => {
      if (employee.status === 'Complété') return; // Skip completed employees

      let currentDate = new Date(startOfWeek);
      
      DEFAULT_CHECKLIST_ITEMS
        .filter(task => selectedDepartment === 'Tous' || task.responsible === selectedDepartment)
        .forEach((task, index) => {
          // Simuler différents statuts selon l'avancement de l'employé
          let status: PlanningTask['status'] = 'Planifié';
          
          if (employee.status === 'Prise de service' && index < 15) {
            status = Math.random() > 0.7 ? 'Complété' : 'En cours';
          } else if (employee.status === 'Accueil' && index < 8) {
            status = Math.random() > 0.5 ? 'Complété' : 'En cours';
          }

          // Calculer les dates
          const taskStartDate = new Date(currentDate);
          const taskEndDate = new Date(currentDate);
          taskEndDate.setHours(taskEndDate.getHours() + task.estimatedDuration);

          // Avancer la date pour la prochaine tâche
          currentDate.setDate(currentDate.getDate() + Math.ceil(task.estimatedDuration / 8));

          planning.push({
            id: `${employee.id}-${task.id}`,
            employeeId: employee.id,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            taskTitle: task.title,
            responsible: task.responsible,
            estimatedDuration: task.estimatedDuration,
            startDate: taskStartDate,
            endDate: taskEndDate,
            status,
            priority: task.mandatory ? 'Haute' : 'Moyenne',
            mandatory: task.mandatory
          });
        });
    });

    return planning.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  const planning = generatePlanning();

  // Grouper par jour
  const groupByDay = (tasks: PlanningTask[]) => {
    const grouped: { [key: string]: PlanningTask[] } = {};
    
    tasks.forEach(task => {
      const dayKey = task.startDate.toISOString().split('T')[0];
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(task);
    });

    return grouped;
  };

  const groupedPlanning = groupByDay(planning);

  // Statistiques
  const getStats = () => {
    return {
      total: planning.length,
      completed: planning.filter(t => t.status === 'Complété').length,
      inProgress: planning.filter(t => t.status === 'En cours').length,
      planned: planning.filter(t => t.status === 'Planifié').length,
      overdue: planning.filter(t => t.status === 'En retard').length
    };
  };

  const stats = getStats();

  const getStatusColor = (status: PlanningTask['status']) => {
    switch (status) {
      case 'Planifié': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En cours': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Complété': return 'bg-green-100 text-green-800 border-green-200';
      case 'En retard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getResponsibleColor = (responsible: 'RH' | 'IT' | 'Sécurité') => {
    switch (responsible) {
      case 'RH': return 'bg-blue-100 text-blue-800';
      case 'IT': return 'bg-purple-100 text-purple-800';
      case 'Sécurité': return 'bg-red-100 text-red-800';
    }
  };

  const getResponsibleIcon = (responsible: 'RH' | 'IT' | 'Sécurité') => {
    switch (responsible) {
      case 'RH': return <Users className="w-4 h-4" />;
      case 'IT': return <Monitor className="w-4 h-4" />;
      case 'Sécurité': return <Shield className="w-4 h-4" />;
    }
  };

  const exportPlanning = () => {
    const csvContent = [
      ['Date', 'Employé', 'Tâche', 'Responsable', 'Durée (h)', 'Statut', 'Priorité'].join(','),
      ...planning.map(task => [
        task.startDate.toLocaleDateString('fr-FR'),
        task.employeeName,
        task.taskTitle,
        task.responsible,
        task.estimatedDuration,
        task.status,
        task.priority
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning-onboarding-${selectedWeek}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Générateur de Planification</h2>
                  <p className="text-indigo-100">Planification des tâches d'accueil</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(95vh-120px)]">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 bg-slate-50 p-6">
              {/* Filtres */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Département
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Tous">Tous les départements</option>
                    <option value="RH">RH uniquement</option>
                    <option value="IT">IT uniquement</option>
                    <option value="Sécurité">Sécurité uniquement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Semaine
                  </label>
                  <input
                    type="week"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vue
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('semaine')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        viewMode === 'semaine'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Semaine
                    </button>
                    <button
                      onClick={() => setViewMode('mois')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        viewMode === 'mois'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Mois
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-slate-900">Statistiques</h3>
                
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total</span>
                    <span className="font-semibold text-slate-900">{stats.total}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Complétées</span>
                    <span className="font-semibold text-green-800">{stats.completed}</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">En cours</span>
                    <span className="font-semibold text-orange-800">{stats.inProgress}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Planifiées</span>
                    <span className="font-semibold text-blue-800">{stats.planned}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={exportPlanning}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter CSV</span>
                </button>
              </div>
            </div>

            {/* Planning Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">
                  Planning de la semaine du {new Date(selectedWeek + '-1').toLocaleDateString('fr-FR')}
                </h3>

                <div className="space-y-6">
                  {Object.entries(groupedPlanning).map(([date, tasks]) => (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <div className="bg-slate-100 px-4 py-3 border-b">
                        <h4 className="font-medium text-slate-900">
                          {new Date(date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        <p className="text-sm text-slate-600">{tasks.length} tâche(s) planifiée(s)</p>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-3">
                          {tasks.map(task => (
                            <div key={task.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                              <div className="flex-shrink-0">
                                {task.status === 'Complété' ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : task.status === 'En retard' ? (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                ) : (
                                  <Clock className="w-5 h-5 text-orange-500" />
                                )}
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-slate-900">{task.taskTitle}</h5>
                                  {task.mandatory && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                      Obligatoire
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600">{task.employeeName}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getResponsibleColor(task.responsible)}`}>
                                    {getResponsibleIcon(task.responsible)}
                                    <span className="ml-1">{task.responsible}</span>
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {task.estimatedDuration}h
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex-shrink-0">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(groupedPlanning).length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune tâche planifiée</h3>
                    <p className="text-slate-600">
                      Aucune tâche n'est planifiée pour cette période avec les filtres sélectionnés.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Fonctions utilitaires
function getDateFromWeekString(weekString: string): Date {
  const [year, week] = weekString.split('-W');
  const yearNum = parseInt(year, 10);
  const weekNum = parseInt(week, 10);
  
  // Create January 4th of the year (always in week 1)
  const jan4 = new Date(yearNum, 0, 4);
  
  // Calculate the Monday of week 1
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - jan4.getDay() + 1);
  
  // Calculate the Monday of the target week
  const targetMonday = new Date(mondayOfWeek1);
  targetMonday.setDate(mondayOfWeek1.getDate() + (weekNum - 1) * 7);
  
  return targetMonday;
}

function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export default PlanningGenerator;
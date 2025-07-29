import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar, 
  FileText, 
  Filter,
  ArrowLeft,
  Edit3,
  Save,
  X,
  Users,
  Shield,
  Monitor,
  Plus,
  Trash2,
  Edit,
  Search,
  Briefcase
} from 'lucide-react';
import { Employee, ChecklistItem, EmployeeChecklistItem, DEFAULT_CHECKLIST_ITEMS } from '../types';

interface ChecklistManagerProps {
  employee?: Employee;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmployeeStatus?: (employeeId: string, newStatus: Employee['status']) => void;
}

const ChecklistManager: React.FC<ChecklistManagerProps> = ({ 
  employee, 
  isOpen, 
  onClose, 
  onUpdateEmployeeStatus 
}) => {
  const [mode, setMode] = useState<'employee' | 'management'>('employee');
  const [employeeChecklists, setEmployeeChecklists] = useState<EmployeeChecklistItem[]>([]);
  const [masterChecklists, setMasterChecklists] = useState<ChecklistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'RH' | 'IT' | 'Sécurité'>('RH');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  
  // États pour la gestion des checklists
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | 'RH' | 'IT' | 'Sécurité'>('all');
  
  // Formulaire nouvelle checklist
  const [newChecklist, setNewChecklist] = useState({
    title: '',
    description: '',
    responsible: 'RH' as const,
    mandatory: false,
    estimatedDuration: 1,
    category: ''
  });

  // Déterminer le mode d'ouverture
  useEffect(() => {
    if (employee) {
      setMode('employee');
    } else {
      setMode('management');
    }
  }, [employee]);

  // Charger les checklists depuis localStorage
  useEffect(() => {
    const savedEmployee = localStorage.getItem('employee-checklists');
    if (savedEmployee) {
      setEmployeeChecklists(JSON.parse(savedEmployee));
    }

    const savedMaster = localStorage.getItem('master-checklists');
    if (savedMaster) {
      setMasterChecklists(JSON.parse(savedMaster));
    } else {
      setMasterChecklists(DEFAULT_CHECKLIST_ITEMS);
    }
  }, []);

  // Sauvegarder les checklists
  useEffect(() => {
    if (employeeChecklists.length > 0) {
      localStorage.setItem('employee-checklists', JSON.stringify(employeeChecklists));
    }
  }, [employeeChecklists]);

  useEffect(() => {
    if (masterChecklists.length > 0) {
      localStorage.setItem('master-checklists', JSON.stringify(masterChecklists));
    }
  }, [masterChecklists]);

  // Initialiser la checklist pour l'employé si elle n'existe pas
  useEffect(() => {
    if (employee && isOpen && mode === 'employee') {
      const existingItems = employeeChecklists.filter(item => item.employeeId === employee.id);
      
      if (existingItems.length === 0) {
        const newItems: EmployeeChecklistItem[] = masterChecklists.map(item => ({
          id: `${employee.id}-${item.id}`,
          employeeId: employee.id,
          checklistItemId: item.id,
          status: 'Non commencé',
          notes: ''
        }));
        
        setEmployeeChecklists(prev => [...prev, ...newItems]);
      }
    }
  }, [employee, isOpen, mode, employeeChecklists, masterChecklists]);

  // Gestion des checklists maîtres
  const handleAddChecklist = () => {
    if (!newChecklist.title.trim() || !newChecklist.description.trim()) {
      return;
    }

    const checklist: ChecklistItem = {
      id: `${newChecklist.responsible.toLowerCase()}-${Date.now()}`,
      title: newChecklist.title,
      description: newChecklist.description,
      responsible: newChecklist.responsible,
      mandatory: newChecklist.mandatory,
      estimatedDuration: newChecklist.estimatedDuration,
      order: masterChecklists.filter(c => c.responsible === newChecklist.responsible).length + 1,
      category: newChecklist.category || 'Général'
    };

    setMasterChecklists(prev => [...prev, checklist]);
    setNewChecklist({
      title: '',
      description: '',
      responsible: 'RH',
      mandatory: false,
      estimatedDuration: 1,
      category: ''
    });
    setShowAddForm(false);
  };

  const handleEditChecklist = (checklist: ChecklistItem) => {
    setEditingChecklist(checklist);
    setNewChecklist({
      title: checklist.title,
      description: checklist.description,
      responsible: checklist.responsible,
      mandatory: checklist.mandatory,
      estimatedDuration: checklist.estimatedDuration,
      category: checklist.category
    });
    setShowAddForm(true);
  };

  const handleUpdateChecklist = () => {
    if (!editingChecklist || !newChecklist.title.trim() || !newChecklist.description.trim()) {
      return;
    }

    setMasterChecklists(prev => prev.map(item => 
      item.id === editingChecklist.id 
        ? {
            ...item,
            title: newChecklist.title,
            description: newChecklist.description,
            responsible: newChecklist.responsible,
            mandatory: newChecklist.mandatory,
            estimatedDuration: newChecklist.estimatedDuration,
            category: newChecklist.category || 'Général'
          }
        : item
    ));

    setEditingChecklist(null);
    setNewChecklist({
      title: '',
      description: '',
      responsible: 'RH',
      mandatory: false,
      estimatedDuration: 1,
      category: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteChecklist = (checklistId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette checklist ?')) {
      setMasterChecklists(prev => prev.filter(item => item.id !== checklistId));
      
      // Supprimer aussi les instances employés de cette checklist
      setEmployeeChecklists(prev => prev.filter(item => item.checklistItemId !== checklistId));
    }
  };

  // Fonctions pour le mode employé (existantes)
  const updateTaskStatus = (
    checklistItemId: string, 
    status: EmployeeChecklistItem['status'],
    completedBy?: string,
    notes?: string
  ) => {
    if (!employee) return;

    setEmployeeChecklists(prev => prev.map(item => {
      if (item.employeeId === employee.id && item.checklistItemId === checklistItemId) {
        return {
          ...item,
          status,
          completedDate: status === 'Complété' ? new Date().toISOString() : item.completedDate,
          completedBy: status === 'Complété' ? (completedBy || 'Système') : item.completedBy,
          notes: notes !== undefined ? notes : item.notes
        };
      }
      return item;
    }));

    setTimeout(() => {
      checkEmployeeCompletion();
    }, 100);
  };

  const checkEmployeeCompletion = () => {
    if (!employee || !onUpdateEmployeeStatus) return;

    const employeeTasks = employeeChecklists.filter(item => item.employeeId === employee.id);
    const mandatoryTasks = masterChecklists.filter(item => item.mandatory);
    
    const completedMandatoryTasks = employeeTasks.filter(task => {
      const checklistItem = masterChecklists.find(item => item.id === task.checklistItemId);
      return checklistItem?.mandatory && task.status === 'Complété';
    });

    if (completedMandatoryTasks.length === mandatoryTasks.length) {
      if (employee.status !== 'Complété') {
        onUpdateEmployeeStatus(employee.id, 'Complété');
      }
    }
  };

  // Filtrer les checklists pour la gestion
  const getFilteredChecklists = () => {
    return masterChecklists.filter(checklist => {
      const matchesSearch = 
        checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || checklist.responsible === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  };

  // Obtenir les statistiques par département pour le mode employé
  const getDepartmentStats = (department: 'RH' | 'IT' | 'Sécurité') => {
    if (!employee) return { total: 0, completed: 0, inProgress: 0, mandatory: 0 };

    const tasks = employeeChecklists.filter(item => item.employeeId === employee.id);
    const departmentTasks = tasks.filter(task => {
      const checklistItem = masterChecklists.find(item => item.id === task.checklistItemId);
      return checklistItem?.responsible === department;
    });
    
    return {
      total: departmentTasks.length,
      completed: departmentTasks.filter(t => t.status === 'Complété').length,
      inProgress: departmentTasks.filter(t => t.status === 'En cours').length,
      mandatory: departmentTasks.filter(task => {
        const checklistItem = masterChecklists.find(item => item.id === task.checklistItemId);
        return checklistItem?.mandatory;
      }).length
    };
  };

  // Obtenir les tâches par département pour le mode employé
  const getTasksByDepartment = (department: 'RH' | 'IT' | 'Sécurité') => {
    return masterChecklists
      .filter(task => task.responsible === department)
      .sort((a, b) => a.order - b.order);
  };

  const getStatusColor = (status: EmployeeChecklistItem['status']) => {
    switch (status) {
      case 'Non commencé': return 'text-gray-500';
      case 'En cours': return 'text-orange-500';
      case 'Complété': return 'text-green-500';
      case 'En retard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: EmployeeChecklistItem['status']) => {
    switch (status) {
      case 'Non commencé': return <Square className="w-5 h-5" />;
      case 'En cours': return <Clock className="w-5 h-5" />;
      case 'Complété': return <CheckSquare className="w-5 h-5" />;
      case 'En retard': return <AlertCircle className="w-5 h-5" />;
      default: return <Square className="w-5 h-5" />;
    }
  };

  const getTabIcon = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return <Users className="w-5 h-5" />;
      case 'IT': return <Monitor className="w-5 h-5" />;
      case 'Sécurité': return <Shield className="w-5 h-5" />;
    }
  };

  const getTabColor = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return 'blue';
      case 'IT': return 'purple';
      case 'Sécurité': return 'red';
    }
  };

  const handleEditNotes = (taskId: string, currentNotes: string) => {
    setEditingNotes(taskId);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (checklistItemId: string) => {
    if (!employee) return;

    const currentTask = employeeChecklists.find(
      item => item.employeeId === employee.id && item.checklistItemId === checklistItemId
    );
    
    updateTaskStatus(checklistItemId, currentTask?.status || 'Non commencé', currentTask?.completedBy, tempNotes);
    setEditingNotes(null);
    setTempNotes('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setTempNotes('');
  };

  if (!isOpen) return null;

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
            className="fixed right-0 top-0 h-full w-full max-w-6xl bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
                
                {mode === 'employee' && employee && (
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      employee.status === 'Complété' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Prise de service' ? 'bg-orange-100 text-orange-800' :
                      employee.status === 'Accueil' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Process Flow Indicator */}
              {mode === 'employee' && employee && (
                <div className="mb-6">
                  <div className="flex items-center justify-between relative px-4">
                    {/* Progress Line */}
                    <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200"></div>
                    <div 
                      className="absolute top-4 left-8 h-0.5 bg-teal-500 transition-all duration-500"
                      style={{ 
                        width: `${
                          employee.status === 'Préparation' ? '0%' :
                          employee.status === 'Accueil' ? '20%' :
                          employee.status === 'Prise de service' ? '80%' :
                          employee.status === 'Complété' ? '100%' : '0%'
                        }` 
                      }}
                    ></div>
                    
                    {/* Process Steps */}
                    {[
                      { key: 'Préparation', label: 'Préparation', icon: Clock },
                      { key: 'Accueil', label: 'Arrivée', icon: User },
                      { key: 'integration', label: 'Activités d\'intégration', icon: CheckSquare },
                      { key: 'presentation', label: 'Présentation au département', icon: Users },
                      { key: 'Prise de service', label: 'Prise de service', icon: Briefcase },
                      { key: 'Complété', label: 'Fin', icon: CheckCircle }
                    ].map((step, index) => {
                      const isActive = 
                        (employee.status === 'Préparation' && step.key === 'Préparation') ||
                        (employee.status === 'Accueil' && ['Préparation', 'Accueil'].includes(step.key)) ||
                        (employee.status === 'Prise de service' && ['Préparation', 'Accueil', 'integration', 'presentation', 'Prise de service'].includes(step.key)) ||
                        (employee.status === 'Complété' && true);
                      
                      const isCurrent = 
                        (employee.status === 'Préparation' && step.key === 'Préparation') ||
                        (employee.status === 'Accueil' && step.key === 'Accueil') ||
                        (employee.status === 'Prise de service' && step.key === 'integration') ||
                        (employee.status === 'Complété' && step.key === 'Complété');
                      
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive 
                              ? isCurrent
                                ? 'bg-teal-500 border-teal-500 text-white shadow-lg'
                                : 'bg-teal-100 border-teal-500 text-teal-700'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <div className={`mt-2 text-xs font-medium text-center max-w-20 leading-tight ${
                            isActive ? 'text-slate-900' : 'text-slate-500'
                          }`}>
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {mode === 'employee' && employee ? (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {employee.firstName} {employee.lastName}
                    </h2>
                    <p className="text-slate-600">{employee.position}</p>
                    <p className="text-sm text-slate-500">{employee.department} - {employee.site}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestion des Listes de Contrôle</h2>
                    <p className="text-slate-600">Ajouter, modifier et supprimer les tâches d'accueil</p>
                  </div>
                </div>
              )}
            </div>

            {mode === 'employee' && employee ? (
              // Mode employé (code existant)
              <>
                {/* Onglets */}
                <div className="border-b border-slate-200 bg-slate-50">
                  <div className="flex space-x-0">
                    {(['RH', 'IT', 'Sécurité'] as const).map((department) => {
                      const stats = getDepartmentStats(department);
                      const color = getTabColor(department);
                      const isActive = activeTab === department;
                      
                      return (
                        <button
                          key={department}
                          onClick={() => setActiveTab(department)}
                          className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            isActive
                              ? `border-${color}-500 text-${color}-600 bg-white`
                              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {getTabIcon(department)}
                            <span>{department}</span>
                          </div>
                          <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
                            <span className="text-green-600">{stats.completed}/{stats.total}</span>
                            {stats.mandatory > 0 && (
                              <span className="text-red-600">({stats.mandatory} obligatoires)</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contenu de l'onglet employé */}
                <div className="p-6">
                  {/* Statistiques du département */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className={`bg-${getTabColor(activeTab)}-50 p-3 rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs text-${getTabColor(activeTab)}-600`}>Total</p>
                          <p className={`text-lg font-bold text-${getTabColor(activeTab)}-800`}>{getDepartmentStats(activeTab).total}</p>
                        </div>
                        <FileText className={`w-6 h-6 text-${getTabColor(activeTab)}-500`} />
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-600">Complétées</p>
                          <p className="text-lg font-bold text-green-800">{getDepartmentStats(activeTab).completed}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-orange-600">En Cours</p>
                          <p className="text-lg font-bold text-orange-800">{getDepartmentStats(activeTab).inProgress}</p>
                        </div>
                        <Clock className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-red-600">Obligatoires</p>
                          <p className="text-lg font-bold text-red-800">{getDepartmentStats(activeTab).mandatory}</p>
                        </div>
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Liste des tâches employé */}
                  <h3 className="text-lg font-semibold mb-4">Tâches {activeTab}</h3>
                  <div className="space-y-4">
                    {getTasksByDepartment(activeTab).map(task => {
                      const employeeTasks = employeeChecklists.filter(item => item.employeeId === employee.id);
                      const employeeTask = employeeTasks.find(et => et.checklistItemId === task.id);
                      const currentStatus = employeeTask?.status || 'Non commencé';
                      
                      return (
                        <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <button
                                onClick={() => {
                                  const newStatus = currentStatus === 'Complété' ? 'Non commencé' : 
                                                 currentStatus === 'Non commencé' ? 'En cours' : 'Complété';
                                  updateTaskStatus(task.id, newStatus, 'Utilisateur système');
                                }}
                                className={`${getStatusColor(currentStatus)} hover:opacity-70 transition-opacity`}
                              >
                                {getStatusIcon(currentStatus)}
                              </button>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                    {task.mandatory && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        Obligatoire
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                  <p className="text-xs text-gray-500">Durée estimée: {task.estimatedDuration}h</p>
                                  
                                  {employeeTask?.completedDate && (
                                    <p className="text-xs text-green-600 mt-1">
                                      Complété le {new Date(employeeTask.completedDate).toLocaleDateString('fr-FR')}
                                      {employeeTask.completedBy && ` par ${employeeTask.completedBy}`}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="flex-shrink-0 ml-4">
                                  <select
                                    value={currentStatus}
                                    onChange={(e) => updateTaskStatus(
                                      task.id, 
                                      e.target.value as EmployeeChecklistItem['status'],
                                      'Utilisateur système'
                                    )}
                                    className="text-sm border border-gray-300 rounded px-2 py-1"
                                  >
                                    <option value="Non commencé">Non commencé</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Complété">Complété</option>
                                    <option value="En retard">En retard</option>
                                  </select>
                                </div>
                              </div>
                              
                              {/* Zone de notes */}
                              <div className="mt-3">
                                {editingNotes === task.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={tempNotes}
                                      onChange={(e) => setTempNotes(e.target.value)}
                                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 resize-none"
                                      rows={3}
                                      placeholder="Ajouter des notes..."
                                    />
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleSaveNotes(task.id)}
                                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                      >
                                        <Save className="w-3 h-3" />
                                        <span>Sauvegarder</span>
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                        <span>Annuler</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between">
                                    <p className="text-sm text-gray-600 flex-grow">
                                      {employeeTask?.notes || 'Aucune note'}
                                    </p>
                                    <button
                                      onClick={() => handleEditNotes(task.id, employeeTask?.notes || '')}
                                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              // Mode gestion des checklists
              <div className="p-6">
                {/* Barre d'actions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une checklist
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value as any)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">Tous les départements</option>
                      <option value="RH">RH</option>
                      <option value="IT">IT</option>
                      <option value="Sécurité">Sécurité</option>
                    </select>
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    {getFilteredChecklists().length} checklist(s)
                  </div>
                </div>

                {/* Liste des checklists */}
                <div className="space-y-4">
                  {getFilteredChecklists().map(checklist => (
                    <div key={checklist.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{checklist.title}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              checklist.responsible === 'RH' ? 'bg-blue-100 text-blue-800' :
                              checklist.responsible === 'IT' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {checklist.responsible}
                            </span>
                            {checklist.mandatory && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Obligatoire
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{checklist.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Durée: {checklist.estimatedDuration}h</span>
                            <span>Catégorie: {checklist.category}</span>
                            <span>Ordre: {checklist.order}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditChecklist(checklist)}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChecklist(checklist.id)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulaire d'ajout/modification */}
                {showAddForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {editingChecklist ? 'Modifier la checklist' : 'Nouvelle checklist'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingChecklist(null);
                              setNewChecklist({
                                title: '',
                                description: '',
                                responsible: 'RH',
                                mandatory: false,
                                estimatedDuration: 1,
                                category: ''
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom de la tâche *
                          </label>
                          <input
                            type="text"
                            value={newChecklist.title}
                            onChange={(e) => setNewChecklist({ ...newChecklist, title: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ex: Formation sécurité spécifique"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            value={newChecklist.description}
                            onChange={(e) => setNewChecklist({ ...newChecklist, description: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                            placeholder="Description détaillée de la tâche..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Département responsable *
                            </label>
                            <select
                              value={newChecklist.responsible}
                              onChange={(e) => setNewChecklist({ ...newChecklist, responsible: e.target.value as any })}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="RH">Ressources Humaines</option>
                              <option value="IT">Informatique</option>
                              <option value="Sécurité">Sécurité</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Durée estimée (heures) *
                            </label>
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={newChecklist.estimatedDuration}
                              onChange={(e) => setNewChecklist({ ...newChecklist, estimatedDuration: parseFloat(e.target.value) || 1 })}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Catégorie
                          </label>
                          <input
                            type="text"
                            value={newChecklist.category}
                            onChange={(e) => setNewChecklist({ ...newChecklist, category: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ex: Formation, Équipement, Administratif..."
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mandatory"
                            checked={newChecklist.mandatory}
                            onChange={(e) => setNewChecklist({ ...newChecklist, mandatory: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="mandatory" className="ml-2 text-sm text-slate-700">
                            Tâche obligatoire
                          </label>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingChecklist(null);
                              setNewChecklist({
                                title: '',
                                description: '',
                                responsible: 'RH',
                                mandatory: false,
                                estimatedDuration: 1,
                                category: ''
                              });
                            }}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={editingChecklist ? handleUpdateChecklist : handleAddChecklist}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            {editingChecklist ? 'Modifier' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChecklistManager;
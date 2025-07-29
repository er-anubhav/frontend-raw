import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { uiActions } from '../features/ui/uiSlice';
import { addEmployee } from '../features/employees/employeeSlice';
import { 
  X, User, Building, MapPin, Calendar, Briefcase, Shield, Users, 
  FileText, Clock, CheckSquare, MessageSquare, ArrowLeft, Save, 
  Plus, Bell, Eye, Edit, Grid3X3, List, Filter, Search, Send
} from 'lucide-react';
import { Employee, Responsable, DEPARTMENT_TASKS } from '../types';
import ChecklistManager from '../components/ChecklistManager';
import NotificationManager from '../components/NotificationManager';

const NewEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const { responsables } = useAppSelector((state) => state.responsables);
  
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | string>('all');
  const [showChecklistManager, setShowChecklistManager] = useState(false);
  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeForNotification, setSelectedEmployeeForNotification] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    site: '',
    arrivalDate: '',
    contractStartDate: '',
    contractEndDate: '',
    contractType: 'CDI' as const,
    requiredPPE: '',
    plannedTraining: '',
    hrResponsible: '',
    itResponsible: '',
    securityResponsible: '',
    hrTasks: [] as string[],
    itTasks: [] as string[],
    securityTasks: [] as string[],
    additionalComments: '',
    status: 'Préparation' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrer les employés : arrivées futures sans notification
  const getUpcomingArrivals = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return employees.filter(emp => {
      const arrivalDate = new Date(emp.arrivalDate);
      arrivalDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // Arrivée future ou aujourd'hui
      const isFutureOrToday = arrivalDate >= today;
      
      // Pas encore de notification (simulation - on considère que les employés en "Préparation" n'ont pas eu de notification)
      const noNotificationSent = emp.status === 'Préparation';
      
      console.log(`Employee: ${emp.firstName} ${emp.lastName}, Arrival: ${emp.arrivalDate}, Today: ${today.toISOString().split('T')[0]}, Future: ${isFutureOrToday}, Status: ${emp.status}, NoNotif: ${noNotificationSent}`);
      
      return isFutureOrToday && noNotificationSent;
    });
  };

  // Filtrer selon les critères de recherche
  const getFilteredUpcomingArrivals = () => {
    const upcomingArrivals = getUpcomingArrivals();
    
    return upcomingArrivals.filter(emp => {
      const matchesSearch = 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.position.trim()) newErrors.position = 'Poste requis';
    if (!formData.department) newErrors.department = 'Département requis';
    if (!formData.site) newErrors.site = 'Site requis';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Date d\'arrivée requise';
    if (!formData.contractStartDate) newErrors.contractStartDate = 'Date de début de contrat requise';
    if (formData.contractType === 'CDD' && !formData.contractEndDate) {
      newErrors.contractEndDate = 'Date de fin requise pour un CDD';
    }
    if (!formData.hrResponsible) newErrors.hrResponsible = 'Responsable RH requis';
    if (!formData.itResponsible) newErrors.itResponsible = 'Responsable IT requis';
    if (!formData.securityResponsible) newErrors.securityResponsible = 'Responsable Sécurité requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newEmployee: Employee = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      dispatch(addEmployee(newEmployee));
      setCurrentView('list');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        position: '',
        department: '',
        site: '',
        arrivalDate: '',
        contractStartDate: '',
        contractEndDate: '',
        contractType: 'CDI',
        requiredPPE: '',
        plannedTraining: '',
        hrResponsible: '',
        itResponsible: '',
        securityResponsible: '',
        hrTasks: [],
        itTasks: [],
        securityTasks: [],
        additionalComments: '',
        status: 'Préparation'
      });
      setErrors({});
    }
  };

  const handleTaskToggle = (department: 'hrTasks' | 'itTasks' | 'securityTasks', task: string) => {
    setFormData(prev => ({
      ...prev,
      [department]: prev[department].includes(task)
        ? prev[department].filter(t => t !== task)
        : [...prev[department], task]
    }));
  };

  const handleViewEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowChecklistManager(true);
  };

  const handleUpdateEmployeeStatus = (employeeId: string, newStatus: Employee['status']) => {
    // Cette fonction sera implémentée si nécessaire
    console.log('Update employee status:', employeeId, newStatus);
  };

  const handleNotificationClick = (employee: Employee) => {
    // Naviguer vers la page des notifications d'arrivée
    dispatch(uiActions.setCurrentView('notifications'));
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Préparation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accueil': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prise de service': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Complété': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getDaysUntilArrival = (arrivalDate: string) => {
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const diffTime = arrival.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays > 0) return `Dans ${diffDays} jours`;
    return `Il y a ${Math.abs(diffDays)} jours`;
  };

  const hrResponsables = responsables.filter(r => r.department === 'RH');
  const itResponsables = responsables.filter(r => r.department === 'IT');
  const securityResponsables = responsables.filter(r => r.department === 'Sécurité');

  const filteredArrivals = getFilteredUpcomingArrivals();
  const departments = [...new Set(employees.map(emp => emp.department))];

  if (currentView === 'form') {
    return (
      <div className="max-w-full space-y-4 overflow-hidden">
        {/* Titre de la page */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Planification des Nouveaux Arrivées</h1>
          <p className="text-sm text-slate-600 mt-1">Créer un nouveau processus d'accueil</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(uiActions.setCurrentView('dashboard'))}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Retour à la liste</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Nouvel Accueil</h2>
                <p className="text-slate-200 text-sm">Créer un nouveau processus d'accueil</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
              {/* Informations Personnelles */}
              <div className="space-y-4 min-w-0">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Personnelles
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Ex: Alexandre"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Ex: Tremblay"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Poste *
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.position ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Ex: Opérateur de foreuse"
                    />
                    {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Building className="w-4 h-4 inline mr-1" />
                        Département *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.department ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Mine">Mine</option>
                        <option value="Services Généraux">Services Généraux</option>
                        <option value="Usines">Usines</option>
                        <option value="Sécurité">Sécurité</option>
                        <option value="Camp">Camp</option>
                        <option value="Finance">Finance</option>
                      </select>
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Site *
                      </label>
                      <select
                        value={formData.site}
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.site ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Mine Nord">Mine Nord</option>
                        <option value="Mine Sud">Mine Sud</option>
                        <option value="Site Central">Site Central</option>
                        <option value="Usine de traitement">Usine de traitement</option>
                        <option value="Camp Résidentiel">Camp Résidentiel</option>
                        <option value="Bureau Principal">Bureau Principal</option>
                      </select>
                      {errors.site && <p className="text-red-500 text-xs mt-1">{errors.site}</p>}
                    </div>
                  </div>
                </div>

                {/* Informations Contractuelles */}
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Informations Contractuelles
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type de contrat *
                    </label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="CDI">CDI - Contrat à Durée Indéterminée</option>
                      <option value="CDD">CDD - Contrat à Durée Déterminée</option>
                      <option value="Stage">Stage</option>
                      <option value="Intérim">Intérim</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date d'arrivée *
                      </label>
                      <input
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.arrivalDate ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.arrivalDate && <p className="text-red-500 text-xs mt-1">{errors.arrivalDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Début de contrat *
                      </label>
                      <input
                        type="date"
                        value={formData.contractStartDate}
                        onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.contractStartDate ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.contractStartDate && <p className="text-red-500 text-xs mt-1">{errors.contractStartDate}</p>}
                    </div>
                  </div>

                  {formData.contractType === 'CDD' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fin de contrat *
                      </label>
                      <input
                        type="date"
                        value={formData.contractEndDate}
                        onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.contractEndDate ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.contractEndDate && <p className="text-red-500 text-xs mt-1">{errors.contractEndDate}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Tâches par Département */}
              <div className="space-y-6">
                {/* Tâches RH */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Tâches Ressources Humaines
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Responsable RH *
                    </label>
                    <select
                      value={formData.hrResponsible}
                      onChange={(e) => setFormData({ ...formData, hrResponsible: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.hrResponsible ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Sélectionner...</option>
                      {hrResponsables.map(resp => (
                        <option key={resp.id} value={resp.name}>{resp.name} - {resp.role}</option>
                      ))}
                    </select>
                    {errors.hrResponsible && <p className="text-red-500 text-xs mt-1">{errors.hrResponsible}</p>}
                  </div>

                  <div className="space-y-2">
                    {DEPARTMENT_TASKS.RH.map(task => (
                      <label key={task} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.hrTasks.includes(task)}
                          onChange={() => handleTaskToggle('hrTasks', task)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{task}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tâches IT */}
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Tâches Informatiques
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Responsable IT *
                    </label>
                    <select
                      value={formData.itResponsible}
                      onChange={(e) => setFormData({ ...formData, itResponsible: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.itResponsible ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Sélectionner...</option>
                      {itResponsables.map(resp => (
                        <option key={resp.id} value={resp.name}>{resp.name} - {resp.role}</option>
                      ))}
                    </select>
                    {errors.itResponsible && <p className="text-red-500 text-xs mt-1">{errors.itResponsible}</p>}
                  </div>

                  <div className="space-y-2">
                    {DEPARTMENT_TASKS.IT.map(task => (
                      <label key={task} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.itTasks.includes(task)}
                          onChange={() => handleTaskToggle('itTasks', task)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span>{task}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tâches Sécurité */}
                <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Tâches Santé & Sécurité
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Responsable Sécurité *
                    </label>
                    <select
                      value={formData.securityResponsible}
                      onChange={(e) => setFormData({ ...formData, securityResponsible: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.securityResponsible ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Sélectionner...</option>
                      {securityResponsables.map(resp => (
                        <option key={resp.id} value={resp.name}>{resp.name} - {resp.role}</option>
                      ))}
                    </select>
                    {errors.securityResponsible && <p className="text-red-500 text-xs mt-1">{errors.securityResponsible}</p>}
                  </div>

                  <div className="space-y-2">
                    {DEPARTMENT_TASKS.Sécurité.map(task => (
                      <label key={task} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.securityTasks.includes(task)}
                          onChange={() => handleTaskToggle('securityTasks', task)}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <span>{task}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations Supplémentaires */}
            <div className="mt-8 bg-slate-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                <MessageSquare className="w-5 h-5 mr-2 text-slate-600" />
                Informations Supplémentaires
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    EPI Requis
                  </label>
                  <textarea
                    value={formData.requiredPPE}
                    onChange={(e) => setFormData({ ...formData, requiredPPE: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ex: Casque, chaussures de sécurité, gants anti-vibration..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Formation Planifiée
                  </label>
                  <textarea
                    value={formData.plannedTraining}
                    onChange={(e) => setFormData({ ...formData, plannedTraining: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ex: Formation sécurité minière, utilisation foreuse hydraulique..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Commentaires Supplémentaires
                </label>
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  rows={4}
                  placeholder="Informations particulières, besoins spécifiques, remarques..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-white rounded-lg transition-colors flex items-center space-x-2"
                style={{backgroundColor: '#077A7D'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#065a5d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#077A7D'}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Vue liste des arrivées à venir
  return (
    <div className="max-w-full space-y-4 overflow-hidden">
      {/* Titre de la page */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Planification des Nouveaux Arrivées</h1>
        <p className="text-sm text-slate-600 mt-1">Gestion et planification des arrivées futures</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('form')}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors text-sm"
            style={{backgroundColor: '#077A7D'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#065a5d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#077A7D'}
          >
            <Plus className="w-4 h-4 mr-2" />
            + Accueil
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border" style={{background: 'linear-gradient(to bottom right, #f0fdfd, #e6ffff)', borderColor: '#b3f0f0'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{color: '#065a5d'}}>Arrivées à venir</p>
              <p className="text-xl font-bold" style={{color: '#044d50'}}>{getUpcomingArrivals().length}</p>
            </div>
            <Calendar className="w-8 h-8" style={{color: '#077A7D'}} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-700">Sans notification</p>
              <p className="text-xl font-bold text-yellow-900">
                {getUpcomingArrivals().filter(emp => emp.status === 'Préparation').length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">Cette semaine</p>
              <p className="text-xl font-bold text-green-900">
                {getUpcomingArrivals().filter(emp => {
                  const arrival = new Date(emp.arrivalDate);
                  const today = new Date();
                  const endOfWeek = new Date(today);
                  endOfWeek.setDate(today.getDate() + 7);
                  return arrival >= today && arrival <= endOfWeek;
                }).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filtres et contrôles */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-xs w-64"
                style={{'&:focus': {outline: 'none', borderColor: '#077A7D', boxShadow: '0 0 0 2px rgba(7, 122, 125, 0.1)'}}}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-xs"
                style={{'&:focus': {outline: 'none', borderColor: '#077A7D', boxShadow: '0 0 0 2px rgba(7, 122, 125, 0.1)'}}}
              >
                <option value="all">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'table' 
                  ? 'text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              style={viewMode === 'table' ? {backgroundColor: '#077A7D'} : {}}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'cards' 
                  ? 'text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              style={viewMode === 'cards' ? {backgroundColor: '#077A7D'} : {}}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des arrivées */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredArrivals.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Aucune arrivée à venir</h3>
            <p className="text-sm text-slate-600">
              {getUpcomingArrivals().length === 0 
                ? "Aucune arrivée future n'est programmée pour le moment."
                : "Aucune arrivée ne correspond aux critères de recherche."
              }
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date d'arrivée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredArrivals.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {employee.site}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {getDaysUntilArrival(employee.arrivalDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleNotificationClick(employee)}
                          className="transition-colors"
                          style={{color: '#077A7D'}}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#065a5d'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#077A7D'}
                          title="Créer notification d'arrivée"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewEmployeeDetails(employee)}
                          className="transition-colors"
                          style={{color: '#077A7D'}}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#065a5d'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#077A7D'}
                          title="Voir les tâches"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-slate-600 hover:text-slate-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Vue en cartes
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArrivals.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  {/* Header de la carte */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-xs text-slate-600">{employee.position}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>

                  {/* Détails */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Département:</span>
                      <span className="font-medium text-slate-900">{employee.department}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Site:</span>
                      <span className="font-medium text-slate-900">{employee.site}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Arrivée:</span>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">
                          {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-slate-500">
                          {getDaysUntilArrival(employee.arrivalDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Processus d'accueil
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleNotificationClick(employee)}
                        className="p-1 transition-colors"
                        style={{color: '#077A7D'}}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#065a5d'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#077A7D'}
                        title="Créer notification d'arrivée"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewEmployeeDetails(employee)}
                        className="p-1 transition-colors"
                        style={{color: '#077A7D'}}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#065a5d'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#077A7D'}
                        title="Voir les tâches"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checklist Manager Modal */}
      <ChecklistManager
        employee={selectedEmployee}
        isOpen={showChecklistManager}
        onClose={() => {
          setShowChecklistManager(false);
          setSelectedEmployee(null);
        }}
        onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
      />

      {/* Notification Manager Modal */}
    </div>
  );
};

export default NewEmployeePage;
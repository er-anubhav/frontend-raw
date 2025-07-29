import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppSelector';
import { addResponsable, updateResponsable, removeResponsable } from '../features/responsables/responsableSlice';
import { setCurrentView } from '../features/ui/uiSlice';
import { 
  Users, Mail, Phone, Building, Plus, Edit, Trash2, ArrowLeft,
  User, Shield, Monitor, Search, Filter
} from 'lucide-react';
import { Responsable, Employee } from '../types';

const ResponsablesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { responsables } = useAppSelector((state) => state.responsables);
  const { employees } = useAppSelector((state) => state.employees);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResponsable, setEditingResponsable] = useState<Responsable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | 'RH' | 'IT' | 'Sécurité'>('all');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'RH' as const,
    email: '',
    phone: ''
  });

  // Fonction pour remplir automatiquement les champs selon l'employé sélectionné
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    
    if (employeeId) {
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      if (selectedEmployee) {
        let responsableDepartment: 'RH' | 'IT' | 'Sécurité' = 'RH';
        
        if (selectedEmployee.position.toLowerCase().includes('rh') || 
            selectedEmployee.position.toLowerCase().includes('ressources humaines')) {
          responsableDepartment = 'RH';
        } else if (selectedEmployee.position.toLowerCase().includes('it') || 
                   selectedEmployee.position.toLowerCase().includes('informatique') ||
                   selectedEmployee.position.toLowerCase().includes('système')) {
          responsableDepartment = 'IT';
        } else if (selectedEmployee.position.toLowerCase().includes('sécurité') || 
                   selectedEmployee.position.toLowerCase().includes('sûreté')) {
          responsableDepartment = 'Sécurité';
        }
        
        setFormData({
          name: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
          role: selectedEmployee.position,
          department: responsableDepartment,
          email: `${selectedEmployee.firstName.toLowerCase()}.${selectedEmployee.lastName.toLowerCase()}@mine.com`,
          phone: `+33 1 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`
        });
      }
    } else {
      setFormData({
        name: '',
        role: '',
        department: 'RH',
        email: '',
        phone: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResponsable) {
      dispatch(updateResponsable({ ...formData, id: editingResponsable.id }));
    } else {
      dispatch(addResponsable({ ...formData, id: Date.now().toString() }));
    }
    handleCloseForm();
  };

  const handleEdit = (responsable: Responsable) => {
    setEditingResponsable(responsable);
    setFormData({
      name: responsable.name,
      role: responsable.role,
      department: responsable.department,
      email: responsable.email,
      phone: responsable.phone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce responsable ?')) {
      dispatch(removeResponsable(id));
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingResponsable(null);
    setSelectedEmployeeId('');
    setFormData({
      name: '',
      role: '',
      department: 'RH',
      email: '',
      phone: ''
    });
  };

  // Filtrer les responsables
  const filteredResponsables = responsables.filter(resp => {
    const matchesSearch = 
      resp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || resp.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentIcon = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return <Users className="w-5 h-5 text-blue-600" />;
      case 'IT': return <Monitor className="w-5 h-5 text-purple-600" />;
      case 'Sécurité': return <Shield className="w-5 h-5 text-red-600" />;
    }
  };

  const getDepartmentColor = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IT': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sécurité': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="max-w-full space-y-4 overflow-hidden">
      {/* Titre de la page */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Responsables</h1>
        <p className="text-sm text-slate-600 mt-1">Gestion des responsables par département</p>
      </div>

      {showAddForm ? (
        // Formulaire d'ajout/modification
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">
                  {editingResponsable ? 'Modifier le Responsable' : 'Nouveau Responsable'}
                </h2>
                <p className="text-blue-100 text-sm">Ajouter un responsable d'onboarding</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Sélectionner un employé *
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeSelection(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Choisir un employé --</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Marie Dubois"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Rôle/Fonction *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Responsable RH, Technicien IT..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Département *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as Responsable['department'] })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="RH">Ressources Humaines</option>
                  <option value="IT">Informatique</option>
                  <option value="Sécurité">Sécurité</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email professionnel *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="marie.dubois@mine.com"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!selectedEmployeeId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingResponsable ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Liste des responsables
        <div className="space-y-4">
          {/* Header avec bouton d'ajout */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Responsable
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">RH</p>
                  <p className="text-xl font-bold text-blue-900">
                    {responsables.filter(r => r.department === 'RH').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-700">IT</p>
                  <p className="text-xl font-bold text-purple-900">
                    {responsables.filter(r => r.department === 'IT').length}
                  </p>
                </div>
                <Monitor className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-700">Sécurité</p>
                  <p className="text-xl font-bold text-red-900">
                    {responsables.filter(r => r.department === 'Sécurité').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value as any)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les départements</option>
                  <option value="RH">RH</option>
                  <option value="IT">IT</option>
                  <option value="Sécurité">Sécurité</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards des responsables */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredResponsables.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun responsable trouvé</h3>
                <p className="text-sm text-slate-600">
                  {responsables.length === 0 
                    ? "Aucun responsable n'a été ajouté pour le moment."
                    : "Aucun responsable ne correspond aux critères de recherche."
                  }
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResponsables.map((responsable) => (
                    <div
                      key={responsable.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      {/* Header de la carte */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            {getDepartmentIcon(responsable.department)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {responsable.name}
                            </h3>
                            <p className="text-xs text-slate-600">{responsable.role}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDepartmentColor(responsable.department)}`}>
                          {responsable.department}
                        </span>
                      </div>

                      {/* Informations de contact */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 truncate">{responsable.email}</span>
                        </div>
                        {responsable.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-600">{responsable.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          Responsable {responsable.department}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(responsable)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(responsable.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsablesPage;
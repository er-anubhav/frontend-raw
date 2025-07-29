import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCurrentView } from '../features/ui/uiSlice';
import { 
  ClipboardList, Plus, Edit, Trash2, Search, Filter, ArrowLeft,
  Users, Monitor, Shield, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { ChecklistItem, DEFAULT_CHECKLIST_ITEMS } from '../types/checklist';

const ChecklistsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | 'RH' | 'IT' | 'Sécurité'>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible: 'RH' as const,
    mandatory: false,
    estimatedDuration: 1,
    order: 1
  });

  // Charger les checklists
  useEffect(() => {
    const saved = localStorage.getItem('master-checklists');
    if (saved) {
      setChecklists(JSON.parse(saved));
    } else {
      setChecklists(DEFAULT_CHECKLIST_ITEMS);
    }
  }, []);

  // Sauvegarder les checklists
  useEffect(() => {
    if (checklists.length > 0) {
      localStorage.setItem('master-checklists', JSON.stringify(checklists));
    }
  }, [checklists]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingChecklist) {
      // Modification
      setChecklists(prev => prev.map(item => 
        item.id === editingChecklist.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Création
      const newChecklist: ChecklistItem = {
        ...formData,
        id: `${formData.responsible.toLowerCase()}-${Date.now()}`,
        order: checklists.filter(c => c.responsible === formData.responsible).length + 1
      };
      setChecklists(prev => [...prev, newChecklist]);
    }
    
    handleCloseForm();
  };

  const handleEdit = (checklist: ChecklistItem) => {
    setEditingChecklist(checklist);
    setFormData({
      title: checklist.title,
      description: checklist.description,
      responsible: checklist.responsible,
      mandatory: checklist.mandatory,
      estimatedDuration: checklist.estimatedDuration,
      order: checklist.order
    });
    setShowAddForm(true);
  };

  const handleDelete = (checklistId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette checklist ?')) {
      setChecklists(prev => prev.filter(item => item.id !== checklistId));
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingChecklist(null);
    setFormData({
      title: '',
      description: '',
      responsible: 'RH',
      mandatory: false,
      estimatedDuration: 1,
      order: 1
    });
  };

  // Filtrer les checklists
  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = 
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || checklist.responsible === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentIcon = (department: 'RH' | 'IT' | 'Sécurité') => {
    switch (department) {
      case 'RH': return <Users className="w-4 h-4 text-blue-600" />;
      case 'IT': return <Monitor className="w-4 h-4 text-purple-600" />;
      case 'Sécurité': return <Shield className="w-4 h-4 text-red-600" />;
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
        <h1 className="text-xl font-bold text-slate-900">Checklists</h1>
        <p className="text-sm text-slate-600 mt-1">Administration des listes de contrôle d'onboarding</p>
      </div>

      {showAddForm ? (
        // Formulaire d'ajout/modification
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">
                  {editingChecklist ? 'Modifier la Checklist' : 'Nouvelle Checklist'}
                </h2>
                <p className="text-purple-100 text-sm">Ajouter une tâche d'onboarding</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom de la tâche *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Formation sécurité spécifique"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Description détaillée de la tâche..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Département responsable *
                </label>
                <select
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value as any })}
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
                  required
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: parseFloat(e.target.value) || 1 })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mandatory"
                checked={formData.mandatory}
                onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="mandatory" className="ml-2 text-sm text-slate-700">
                Tâche obligatoire
              </label>
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingChecklist ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Liste des checklists
        <div className="space-y-4">
          {/* Header avec bouton d'ajout */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Checklist
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700">Total</p>
                  <p className="text-xl font-bold text-slate-900">{checklists.length}</p>
                </div>
                <ClipboardList className="w-8 h-8 text-slate-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">RH</p>
                  <p className="text-xl font-bold text-blue-900">
                    {checklists.filter(c => c.responsible === 'RH').length}
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
                    {checklists.filter(c => c.responsible === 'IT').length}
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
                    {checklists.filter(c => c.responsible === 'Sécurité').length}
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
                  placeholder="Rechercher une checklist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value as any)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Tous les départements</option>
                  <option value="RH">RH</option>
                  <option value="IT">IT</option>
                  <option value="Sécurité">Sécurité</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des checklists */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredChecklists.length === 0 ? (
              <div className="p-8 text-center">
                <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-slate-900 mb-2">Aucune checklist trouvée</h3>
                <p className="text-sm text-slate-600">
                  {checklists.length === 0 
                    ? "Aucune checklist n'a été créée pour le moment."
                    : "Aucune checklist ne correspond aux critères de recherche."
                  }
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {filteredChecklists.map(checklist => (
                    <div key={checklist.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getDepartmentIcon(checklist.responsible)}
                            <h3 className="font-semibold text-slate-900 text-sm">{checklist.title}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDepartmentColor(checklist.responsible)}`}>
                              {checklist.responsible}
                            </span>
                            {checklist.mandatory && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border-red-200">
                                Obligatoire
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{checklist.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Durée: {checklist.estimatedDuration}h</span>
                            </div>
                            <span>Ordre: {checklist.order}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(checklist)}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(checklist.id)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

export default ChecklistsPage;
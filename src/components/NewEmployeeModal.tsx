import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Building, MapPin, Calendar, Briefcase, Shield, Users, 
  FileText, Clock, CheckSquare, MessageSquare 
} from 'lucide-react';
import { Employee, Responsable, DEPARTMENT_TASKS } from '../types';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  responsables: Responsable[];
}

const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  responsables 
}) => {
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
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
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
    onClose();
  };

  const handleTaskToggle = (department: 'hrTasks' | 'itTasks' | 'securityTasks', task: string) => {
    setFormData(prev => ({
      ...prev,
      [department]: prev[department].includes(task)
        ? prev[department].filter(t => t !== task)
        : [...prev[department], task]
    }));
  };

  const hrResponsables = responsables.filter(r => r.department === 'RH');
  const itResponsables = responsables.filter(r => r.department === 'IT');
  const securityResponsables = responsables.filter(r => r.department === 'Sécurité');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Nouvel Accueil</h2>
                      <p className="text-slate-200">Créer un nouveau processus d'accueil</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informations Personnelles */}
                  <div className="space-y-6">
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
                    onClick={handleClose}
                    className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="px-6 py-3 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewEmployeeModal;
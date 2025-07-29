import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Building } from 'lucide-react';
import { Responsable, Employee } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';

interface ResponsableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (responsable: Omit<Responsable, 'id'>) => void;
  editingResponsable?: Responsable;
}

const ResponsableModal: React.FC<ResponsableModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingResponsable 
}) => {
  const { employees } = useAppSelector((state) => state.employees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: editingResponsable?.name || '',
    role: editingResponsable?.role || '',
    department: editingResponsable?.department || 'RH' as const,
    email: editingResponsable?.email || '',
    phone: editingResponsable?.phone || ''
  });

  // Fonction pour remplir automatiquement les champs selon l'employé sélectionné
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    
    if (employeeId) {
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      if (selectedEmployee) {
        // Mapper le département de l'employé vers le département du responsable
        let responsableDepartment: 'RH' | 'IT' | 'Sécurité' = 'RH';
        
        // Logique de mapping basée sur le poste ou département de l'employé
        if (selectedEmployee.position.toLowerCase().includes('rh') || 
            selectedEmployee.position.toLowerCase().includes('ressources humaines') ||
            selectedEmployee.position.toLowerCase().includes('responsable rh')) {
          responsableDepartment = 'RH';
        } else if (selectedEmployee.position.toLowerCase().includes('it') || 
                   selectedEmployee.position.toLowerCase().includes('informatique') ||
                   selectedEmployee.position.toLowerCase().includes('système') ||
                   selectedEmployee.position.toLowerCase().includes('technicien')) {
          responsableDepartment = 'IT';
        } else if (selectedEmployee.position.toLowerCase().includes('sécurité') || 
                   selectedEmployee.position.toLowerCase().includes('sûreté') ||
                   selectedEmployee.position.toLowerCase().includes('responsable sécurité')) {
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
      // Réinitialiser les champs si aucun employé n'est sélectionné
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
    onSave(formData);
    setSelectedEmployeeId('');
    setFormData({ name: '', role: '', department: 'RH', email: '', phone: '' });
    onClose();
  };

  const handleClose = () => {
    setSelectedEmployeeId('');
    setFormData({ name: '', role: '', department: 'RH', email: '', phone: '' });
    onClose();
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingResponsable ? 'Modifier le Responsable' : 'Ajout d\'un Responsable de l\'accueil'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Sélectionner un employé *
                  </label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => handleEmployeeSelection(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-600 cursor-not-allowed"
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
                    readOnly
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-600 cursor-not-allowed"
                    placeholder="Ex: Responsable RH, Technicien IT..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Département *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Responsable['department'] })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="RH">Ressources Humaines</option>
                    <option value="IT">Informatique</option>
                    <option value="Sécurité">Sécurité</option>
                  </select>
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="marie.dubois@mine.com"
                  />
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedEmployeeId}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {editingResponsable ? 'Modifier' : 'Ajouter'}
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

export default ResponsableModal;
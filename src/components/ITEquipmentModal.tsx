import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Monitor, Smartphone, Laptop, Upload, FileText, Camera, 
  Plus, Trash2, Save, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { ITEquipment, EquipmentFormData, EQUIPMENT_TYPES, POPULAR_BRANDS } from '../types/equipment';
import { Employee } from '../types';

interface ITEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<ITEquipment, 'id' | 'createdAt'>) => void;
  employees: Employee[];
  editingEquipment?: ITEquipment;
}

const ITEquipmentModal: React.FC<ITEquipmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  employees,
  editingEquipment 
}) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    employeeId: editingEquipment?.employeeId || '',
    equipmentType: editingEquipment?.equipmentType || 'Ordinateur portable',
    brand: editingEquipment?.brand || '',
    model: editingEquipment?.model || '',
    specifications: editingEquipment?.specifications || '',
    screenSize: editingEquipment?.screenSize || '',
    serialNumber: editingEquipment?.serialNumber || '',
    condition: editingEquipment?.condition || 'Neuf',
    assignedDate: editingEquipment?.assignedDate || new Date().toISOString().split('T')[0],
    warrantyEndDate: editingEquipment?.warrantyEndDate || '',
    images: [],
    dischargeDocument: undefined,
    notes: editingEquipment?.notes || '',
    assignedBy: editingEquipment?.assignedBy || 'Jean Martin'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>(editingEquipment?.images || []);
  const [dischargePreview, setDischargePreview] = useState<string | null>(editingEquipment?.dischargeDocument || null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Employé requis';
    if (!formData.brand.trim()) newErrors.brand = 'Marque requise';
    if (!formData.model.trim()) newErrors.model = 'Modèle requis';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Numéro de série requis';
    if (!formData.assignedDate) newErrors.assignedDate = 'Date d\'attribution requise';
    if (!formData.assignedBy.trim()) newErrors.assignedBy = 'Responsable requis';

    // Validation de la date de garantie
    if (formData.warrantyEndDate && formData.warrantyEndDate < formData.assignedDate) {
      newErrors.warrantyEndDate = 'La garantie ne peut pas expirer avant l\'attribution';
    }

    // Validation spécifique selon le type d'équipement
    const equipmentConfig = EQUIPMENT_TYPES[formData.equipmentType];
    if (equipmentConfig.fields.includes('specifications') && !formData.specifications.trim()) {
      newErrors.specifications = 'Spécifications requises';
    }
    if (equipmentConfig.fields.includes('screenSize') && formData.equipmentType !== 'Autre' && !formData.screenSize?.trim()) {
      newErrors.screenSize = 'Taille d\'écran requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      
      const equipment: Omit<ITEquipment, 'id' | 'createdAt'> = {
        employeeId: formData.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        equipmentType: formData.equipmentType,
        brand: formData.brand,
        model: formData.model,
        specifications: formData.specifications,
        screenSize: formData.screenSize,
        serialNumber: formData.serialNumber,
        condition: formData.condition,
        assignedDate: formData.assignedDate,
        warrantyEndDate: formData.warrantyEndDate,
        status: 'Assigné',
        images: previewImages,
        dischargeDocument: dischargePreview || undefined,
        notes: formData.notes,
        assignedBy: formData.assignedBy,
        updatedAt: editingEquipment ? new Date().toISOString() : undefined
      };

      onSave(equipment);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      employeeId: '',
      equipmentType: 'Ordinateur portable',
      brand: '',
      model: '',
      specifications: '',
      screenSize: '',
      serialNumber: '',
      condition: 'Neuf',
      assignedDate: new Date().toISOString().split('T')[0],
      warrantyEndDate: '',
      images: [],
      dischargeDocument: undefined,
      notes: '',
      assignedBy: 'Jean Martin'
    });
    setErrors({});
    setPreviewImages([]);
    setDischargePreview(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImages(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDischargePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const getEquipmentIcon = (type: ITEquipment['equipmentType']) => {
    switch (type) {
      case 'Ordinateur portable': return <Laptop className="w-5 h-5" />;
      case 'Ordinateur bureau': return <Monitor className="w-5 h-5" />;
      case 'Téléphone': return <Smartphone className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getConditionColor = (condition: ITEquipment['condition']) => {
    switch (condition) {
      case 'Neuf': return 'bg-green-100 text-green-800 border-green-200';
      case 'Déjà utilisé': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reconditionné': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  {getEquipmentIcon(formData.equipmentType)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingEquipment ? 'Modifier l\'Équipement IT' : 'Enregistrement Équipement IT'}
                  </h2>
                  <p className="text-purple-100">Attribution et suivi des équipements informatiques</p>
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
              {/* Informations de base */}
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Monitor className="w-5 h-5 mr-2 text-purple-600" />
                    Informations de l'Équipement
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Employé bénéficiaire *
                      </label>
                      <select
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.employeeId ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Sélectionner un employé...</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </option>
                        ))}
                      </select>
                      {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type d'équipement *
                      </label>
                      <select
                        value={formData.equipmentType}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          equipmentType: e.target.value as ITEquipment['equipmentType'],
                          brand: '', // Reset brand when type changes
                          specifications: ''
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {Object.keys(EQUIPMENT_TYPES).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Marque *
                        </label>
                        <select
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.brand ? 'border-red-500' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Sélectionner...</option>
                          {POPULAR_BRANDS[formData.equipmentType].map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Modèle *
                        </label>
                        <input
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.model ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Ex: ThinkPad X1 Carbon"
                        />
                        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                      </div>
                    </div>

                    {EQUIPMENT_TYPES[formData.equipmentType].fields.includes('screenSize') && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Taille d'écran *
                        </label>
                        <select
                          value={formData.screenSize}
                          onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.screenSize ? 'border-red-500' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="13 pouces">13 pouces</option>
                          <option value="14 pouces">14 pouces</option>
                          <option value="15 pouces">15 pouces</option>
                          <option value="17 pouces">17 pouces</option>
                          <option value="21 pouces">21 pouces</option>
                          <option value="24 pouces">24 pouces</option>
                          <option value="27 pouces">27 pouces</option>
                          <option value="32 pouces">32 pouces</option>
                          <option value="5.5 pouces">5.5 pouces (Téléphone)</option>
                          <option value="6.1 pouces">6.1 pouces (Téléphone)</option>
                          <option value="6.7 pouces">6.7 pouces (Téléphone)</option>
                        </select>
                        {errors.screenSize && <p className="text-red-500 text-xs mt-1">{errors.screenSize}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Spécifications techniques *
                      </label>
                      <textarea
                        value={formData.specifications}
                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.specifications ? 'border-red-500' : 'border-slate-300'
                        }`}
                        rows={4}
                        placeholder={`Ex: ${EQUIPMENT_TYPES[formData.equipmentType].requiredSpecs.join(', ')}`}
                      />
                      {errors.specifications && <p className="text-red-500 text-xs mt-1">{errors.specifications}</p>}
                      <p className="text-xs text-slate-500 mt-1">
                        Inclure: {EQUIPMENT_TYPES[formData.equipmentType].requiredSpecs.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations d'attribution */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Informations d'Attribution
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Numéro de série *
                        </label>
                        <input
                          type="text"
                          value={formData.serialNumber}
                          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.serialNumber ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Ex: ABC123456789"
                        />
                        {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          État de l'équipement *
                        </label>
                        <select
                          value={formData.condition}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value as ITEquipment['condition'] })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Neuf">Neuf</option>
                          <option value="Déjà utilisé">Déjà utilisé</option>
                          <option value="Reconditionné">Reconditionné</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date d'attribution *
                        </label>
                        <input
                          type="date"
                          value={formData.assignedDate}
                          onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.assignedDate ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors.assignedDate && <p className="text-red-500 text-xs mt-1">{errors.assignedDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Attribué par *
                        </label>
                        <select
                          value={formData.assignedBy}
                          onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.assignedBy ? 'border-red-500' : 'border-slate-300'
                          }`}
                        >
                          <option value="Jean Martin">Jean Martin - Admin Système</option>
                          <option value="Thomas Durand">Thomas Durand - Technicien IT</option>
                        </select>
                        {errors.assignedBy && <p className="text-red-500 text-xs mt-1">{errors.assignedBy}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de fin de garantie
                      </label>
                      <input
                        type="date"
                        value={formData.warrantyEndDate}
                        onChange={(e) => setFormData({ ...formData, warrantyEndDate: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.warrantyEndDate ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.warrantyEndDate && <p className="text-red-500 text-xs mt-1">{errors.warrantyEndDate}</p>}
                      <p className="text-xs text-slate-500 mt-1">
                        Optionnel - Date d'expiration de la garantie constructeur
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes supplémentaires
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Remarques, configurations spéciales, accessoires inclus..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents et images */}
              <div className="space-y-6">
                {/* Images de l'équipement */}
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Camera className="w-5 h-5 mr-2 text-green-600" />
                    Photos de l'Équipement
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-green-700 font-medium">Cliquer pour ajouter des photos</p>
                        <p className="text-xs text-green-600">PNG, JPG jusqu'à 10MB chacune</p>
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Aperçu des images */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {previewImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Équipement ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Document de décharge */}
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-orange-600" />
                    Document de Décharge Signé
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-orange-700 font-medium">Joindre le PDF de décharge signé</p>
                        <p className="text-xs text-orange-600">PDF uniquement, jusqu'à 5MB</p>
                      </button>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handlePDFUpload}
                        className="hidden"
                      />
                    </div>

                    {dischargePreview && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-200">
                        <FileText className="w-8 h-8 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Document de décharge</p>
                          <p className="text-xs text-slate-500">PDF signé joint</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDischargePreview(null)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Résumé de l'attribution */}
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                    <Info className="w-5 h-5 mr-2 text-slate-600" />
                    Résumé de l'Attribution
                  </h3>

                  <div className="space-y-3">
                    {formData.employeeId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Employé:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {employees.find(emp => emp.id === formData.employeeId)?.firstName} {employees.find(emp => emp.id === formData.employeeId)?.lastName}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Équipement:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {formData.equipmentType}
                      </span>
                    </div>
                    
                    {formData.brand && formData.model && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Marque/Modèle:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {formData.brand} {formData.model}
                        </span>
                      </div>
                    )}
                    
                    {formData.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">N° Série:</span>
                        <span className="text-sm font-medium text-slate-900 font-mono">
                          {formData.serialNumber}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">État:</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getConditionColor(formData.condition)}`}>
                        {formData.condition}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Photos:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {previewImages.length} image(s)
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Décharge:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {dischargePreview ? '✓ Jointe' : '✗ Manquante'}
                      </span>
                    </div>
                    
                    {formData.warrantyEndDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Garantie:</span>
                        <span className={`text-sm font-medium ${
                          new Date(formData.warrantyEndDate) < new Date() 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {new Date(formData.warrantyEndDate) < new Date() 
                            ? '⚠️ Expirée' 
                            : '✓ Valide'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingEquipment ? 'Modifier' : 'Enregistrer'} l'Équipement</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ITEquipmentModal;
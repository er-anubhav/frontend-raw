import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import ITEquipmentList from '../components/ITEquipmentList';
import ITEquipmentModal from '../components/ITEquipmentModal';
import { ITEquipment } from '../types/equipment';

const ITEquipmentPage: React.FC = () => {
  const { employees } = useAppSelector((state) => state.employees);
  const [equipment, setEquipment] = useState<ITEquipment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<ITEquipment | undefined>();

  // Charger les équipements depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('it-equipment');
    if (saved) {
      setEquipment(JSON.parse(saved));
    } else {
      // Données d'exemple
      const sampleEquipment: ITEquipment[] = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'Alexandre Tremblay',
          equipmentType: 'Ordinateur portable',
          brand: 'Dell',
          model: 'Latitude 5520',
          specifications: 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, Windows 11 Pro',
          screenSize: '15 pouces',
          serialNumber: 'DL5520ABC123',
          condition: 'Neuf',
          assignedDate: '2024-01-15',
          warrantyEndDate: '2027-01-15',
          status: 'Assigné',
          images: [],
          notes: 'Configuration standard pour opérateur terrain',
          assignedBy: 'Jean Martin',
          createdAt: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          employeeId: '2',
          employeeName: 'Sophie Bergeron',
          equipmentType: 'Ordinateur bureau',
          brand: 'HP',
          model: 'EliteDesk 800 G8',
          specifications: 'Intel Core i7-11700, 32GB RAM, 1TB SSD, Windows 11 Pro',
          serialNumber: 'HP800G8XYZ789',
          condition: 'Neuf',
          assignedDate: '2024-01-22',
          warrantyEndDate: '2027-01-22',
          status: 'Assigné',
          images: [],
          notes: 'Poste de supervision avec double écran',
          assignedBy: 'Jean Martin',
          createdAt: '2024-01-22T09:00:00Z'
        },
        {
          id: '3',
          employeeId: '1',
          employeeName: 'Alexandre Tremblay',
          equipmentType: 'Téléphone',
          brand: 'Samsung',
          model: 'Galaxy S23',
          specifications: 'Android 13, 256GB, 5G, IP68',
          screenSize: '6.1 pouces',
          serialNumber: 'SM-S911BZKA456',
          condition: 'Neuf',
          assignedDate: '2024-01-16',
          warrantyEndDate: '2026-01-16',
          status: 'Assigné',
          images: [],
          notes: 'Téléphone professionnel avec forfait entreprise',
          assignedBy: 'Jean Martin',
          createdAt: '2024-01-16T10:00:00Z'
        }
      ];
      setEquipment(sampleEquipment);
    }
  }, []);

  // Sauvegarder les équipements
  useEffect(() => {
    if (equipment.length > 0) {
      localStorage.setItem('it-equipment', JSON.stringify(equipment));
    }
  }, [equipment]);

  const handleAddEquipment = () => {
    setEditingEquipment(undefined);
    setShowModal(true);
  };

  const handleEditEquipment = (item: ITEquipment) => {
    setEditingEquipment(item);
    setShowModal(true);
  };

  const handleSaveEquipment = (equipmentData: Omit<ITEquipment, 'id' | 'createdAt'>) => {
    if (editingEquipment) {
      // Modification
      setEquipment(prev => prev.map(item => 
        item.id === editingEquipment.id 
          ? { ...equipmentData, id: editingEquipment.id, createdAt: editingEquipment.createdAt }
          : item
      ));
    } else {
      // Création
      const newEquipment: ITEquipment = {
        ...equipmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setEquipment(prev => [...prev, newEquipment]);
    }
    setShowModal(false);
    setEditingEquipment(undefined);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      setEquipment(prev => prev.filter(item => item.id !== equipmentId));
    }
  };

  return (
    <div className="max-w-full overflow-hidden space-y-4">
      {/* Titre de la page */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Équipements IT</h1>
        <p className="text-sm text-slate-600 mt-1">Gestion et attribution des équipements informatiques</p>
      </div>

      <ITEquipmentList
        equipment={equipment}
        onEdit={handleEditEquipment}
        onDelete={handleDeleteEquipment}
        onAdd={handleAddEquipment}
      />

      <ITEquipmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEquipment(undefined);
        }}
        onSave={handleSaveEquipment}
        employees={employees}
        editingEquipment={editingEquipment}
      />
    </div>
  );
};

export default ITEquipmentPage;
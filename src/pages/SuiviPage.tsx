import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../hooks';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSelectedEmployee } from '../features/employees/employeeSlice';
import SuiviIntegrations from '../components/SuiviIntegrations';
import ChecklistManager from '../components/ChecklistManager';
import { Employee } from '../types';

const SuiviPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const [showChecklistManager, setShowChecklistManager] = useState(false);
  const [selectedEmployee, setSelectedEmployeeLocal] = useState<Employee | null>(null);

  const handleViewEmployeeDetails = (employee: Employee) => {
    setSelectedEmployeeLocal(employee);
    dispatch(setSelectedEmployee(employee));
    setShowChecklistManager(true);
  };

  const handleUpdateEmployeeStatus = (employeeId: string, newStatus: Employee['status']) => {
    // Cette fonction sera implémentée si nécessaire
    console.log('Update employee status:', employeeId, newStatus);
  };

  return (
    <>
      {/* Titre de la page */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Suivi des Intégrations</h1>
        <p className="text-sm text-slate-600 mt-1">Suivi détaillé de tous les employés en cours d'intégration</p>
      </div>

      <div className="max-w-full overflow-hidden">
        <SuiviIntegrations 
          employees={employees} 
          onViewEmployeeDetails={handleViewEmployeeDetails}
        />
      </div>
      
      <ChecklistManager
        employee={selectedEmployee}
        isOpen={showChecklistManager}
        onClose={() => {
          setShowChecklistManager(false);
          setSelectedEmployeeLocal(null);
        }}
        onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
      />
    </>
  );
};

export default SuiviPage;
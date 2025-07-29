import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSelectedEmployee } from '../features/employees/employeeSlice';
import FilterBar from '../components/FilterBar';
import KpiPanel from '../components/KpiPanel';
import DashboardCharts from '../components/DashboardCharts';
import ChecklistManager from '../components/ChecklistManager';
import CompletedOnboardingTable from '../components/CompletedOnboardingTable';
import { KPI, Employee } from '../types';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const { filters } = useAppSelector((state) => state.ui);
  const [showChecklistManager, setShowChecklistManager] = useState(false);
  const [selectedEmployee, setSelectedEmployeeLocal] = useState<Employee | null>(null);

  // Calcul des KPI
  const calculateKPI = (): KPI => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekEmployees = employees.filter(emp => 
      new Date(emp.createdAt) >= oneWeekAgo
    );
    
    const completedEmployees = employees.filter(emp => emp.status === 'Complété');
    
    const overdueEmployees = employees.filter(emp => {
      if (emp.status === 'Complété') return false;
      const arrivalDate = new Date(emp.arrivalDate);
      const daysSinceArrival = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceArrival > 6;
    });

    const avgDuration = completedEmployees.length > 0 
      ? Math.round(
          completedEmployees.reduce((acc, emp) => {
            if (emp.completedAt) {
              const start = new Date(emp.arrivalDate);
              const end = new Date(emp.completedAt);
              return acc + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            }
            return acc;
          }, 0) / completedEmployees.length
        )
      : 0;

    return {
      integrationsThisWeek: thisWeekEmployees.length,
      integrationsOverdue: overdueEmployees.length,
      integrationsCompleted: completedEmployees.length,
      averageDuration: avgDuration
    };
  };

  const kpi = calculateKPI();
  const activeEmployees = employees.filter(emp => emp.status !== 'Complété');

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
        <h1 className="text-xl font-bold text-slate-900">Tableau de Bord</h1>
        <p className="text-sm text-slate-600 mt-1">Vue globale du Processus d'Intégration</p>
      </div>

      <div className="space-y-4 w-full overflow-hidden">
        <FilterBar />
        <KpiPanel kpi={kpi} />
        <DashboardCharts employees={employees} filters={filters} />
        <CompletedOnboardingTable employees={employees} />
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

export default Dashboard;
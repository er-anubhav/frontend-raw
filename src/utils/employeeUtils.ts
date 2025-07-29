import { Employee } from '../types';

export const getStatusColor = (status: Employee['status']): string => {
  switch (status) {
    case 'Préparation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Accueil': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Prise de service': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Complété': return 'bg-green-100 text-green-800 border-green-200';
  }
};

export const getProgressPercentage = (status: Employee['status']): number => {
  switch (status) {
    case 'Préparation': return 25;
    case 'Accueil': return 50;
    case 'Prise de service': return 75;
    case 'Complété': return 100;
    default: return 0;
  }
};

export const getDepartmentColor = (department: 'RH' | 'IT' | 'Sécurité'): string => {
  switch (department) {
    case 'RH': return 'blue';
    case 'IT': return 'purple';
    case 'Sécurité': return 'red';
  }
};

export const filterEmployeesByDepartment = (employees: Employee[], department: string): Employee[] => {
  if (department === 'Tous') return employees;
  return employees.filter(emp => emp.department === department);
};

export const filterEmployeesByTimeframe = (employees: Employee[], timeframe: string): Employee[] => {
  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case 'Cette semaine':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay() + 1);
      break;
    case 'Semaine dernière':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay() - 6);
      break;
    case 'Ce mois':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'Mois dernier':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    default:
      return employees;
  }

  return employees.filter(emp => new Date(emp.createdAt) >= startDate);
};
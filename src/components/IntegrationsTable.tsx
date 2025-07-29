import React from 'react';
import { Eye, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Employee } from '../types';

interface IntegrationsTableProps {
  employees: Employee[];
  onViewEmployeeDetails?: (employee: Employee) => void;
}

const IntegrationsTable: React.FC<IntegrationsTableProps> = ({ employees, onViewEmployeeDetails }) => {
  const getStatusIcon = (status: Employee['status']) => {
    switch (status) {
      case 'Préparation': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Accueil': return <User className="w-4 h-4 text-blue-500" />;
      case 'Prise de service': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'Complété': return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Préparation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accueil': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prise de service': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Complété': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getDaysFromStart = (createdAt: string) => {
    const start = new Date(createdAt);
    const now = new Date();
    return Math.ceil((now.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div className="p-4 border-b border-slate-200">
        <p className="text-sm text-slate-600">
          Suivi des processus d'onboarding ({employees.length} employé{employees.length > 1 ? 's' : ''})
        </p>
      </div>
      
      {employees.length === 0 ? (
        <div className="p-8 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">Aucune intégration en cours</h3>
          <p className="text-sm text-slate-600">
            Tous les employés ont terminé leur processus d'onboarding ou aucun employé n'a été ajouté.
          </p>
        </div>
      ) : (
      <div className="overflow-x-auto w-full">
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
                Durée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {employees.map((employee) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                    {getStatusIcon(employee.status)}
                    <span className="ml-1">{employee.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {getDaysFromStart(employee.arrivalDate)} jours
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {onViewEmployeeDetails ? (
                    <button
                      onClick={() => onViewEmployeeDetails(employee)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Voir les tâches
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">
                      En cours
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default IntegrationsTable;
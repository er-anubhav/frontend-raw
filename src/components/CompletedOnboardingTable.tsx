import React from 'react';
import { CheckCircle, User, Calendar, Clock, Building, MapPin } from 'lucide-react';
import { Employee } from '../types';

interface CompletedOnboardingTableProps {
  employees: Employee[];
}

const CompletedOnboardingTable: React.FC<CompletedOnboardingTableProps> = ({ employees }) => {
  // Données fictives pour juillet 2025
  const getCompletedJuly2025 = () => {
    const fictiveCompletedEmployees = [
      {
        id: 'completed-1',
        firstName: 'Marie',
        lastName: 'Dubois',
        position: 'Ingénieure géologue',
        department: 'Mine',
        site: 'Mine Nord',
        arrivalDate: '2025-07-01',
        completedAt: '2025-07-08',
        status: 'Complété' as const
      },
      {
        id: 'completed-2',
        firstName: 'Jean',
        lastName: 'Tremblay',
        position: 'Opérateur de foreuse',
        department: 'Mine',
        site: 'Mine Sud',
        arrivalDate: '2025-07-03',
        completedAt: '2025-07-12',
        status: 'Complété' as const
      },
      {
        id: 'completed-3',
        firstName: 'Sophie',
        lastName: 'Bergeron',
        position: 'Technicienne laboratoire',
        department: 'Usines',
        site: 'Laboratoire Central',
        arrivalDate: '2025-07-08',
        completedAt: '2025-07-18',
        status: 'Complété' as const
      },
      {
        id: 'completed-4',
        firstName: 'Marc',
        lastName: 'Gagnon',
        position: 'Superviseur sécurité',
        department: 'Sécurité',
        site: 'Site Central',
        arrivalDate: '2025-07-10',
        completedAt: '2025-07-22',
        status: 'Complété' as const
      },
      {
        id: 'completed-5',
        firstName: 'Julie',
        lastName: 'Lavoie',
        position: 'Analyste financière',
        department: 'Finance',
        site: 'Bureau Principal',
        arrivalDate: '2025-07-15',
        completedAt: '2025-07-28',
        status: 'Complété' as const
      }
    ];
    
    return fictiveCompletedEmployees;
  };

  const completedEmployees = getCompletedJuly2025();

  const getDaysToComplete = (arrivalDate: string, completedAt: string) => {
    const arrival = new Date(arrivalDate);
    const completion = new Date(completedAt);
    const diffTime = completion.getTime() - arrival.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMonthName = () => {
    return 'Juillet 2025';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-900">
                Accueils Complétés - {getMonthName()}
              </h2>
              <p className="text-sm text-green-700">
                Processus d'accueil terminés ce mois
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-800">{completedEmployees.length}</div>
            <div className="text-xs text-green-600">Complétés</div>
          </div>
        </div>
      </div>
      
      {completedEmployees.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun accueil complété ce mois</h3>
          <p className="text-sm text-slate-600">
            Aucun processus d'accueil n'a été terminé en {getMonthName().toLowerCase()}.
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
                  Date de fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {completedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#f0fdfd'}}>
                          <User className="w-5 h-5" style={{color: '#077A7D'}} />
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900">{employee.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900">{employee.site}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900">
                        {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" style={{color: '#077A7D'}} />
                      <span className="text-sm text-slate-900">
                        {employee.completedAt 
                          ? new Date(employee.completedAt).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {employee.completedAt 
                          ? `${getDaysToComplete(employee.arrivalDate, employee.completedAt)} jours`
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{backgroundColor: '#f0fdfd', color: '#065a5d', borderColor: '#b3f0f0'}}>
                      <CheckCircle className="w-4 h-4 mr-1" style={{color: '#077A7D'}} />
                      Complété
                    </span>
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

export default CompletedOnboardingTable;
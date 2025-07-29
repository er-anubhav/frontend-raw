import React, { useState } from 'react';
import { Eye, Clock, CheckCircle, AlertCircle, User, Calendar, Filter, Search } from 'lucide-react';
import { Employee } from '../types';

interface SuiviIntegrationsProps {
  employees: Employee[];
  onViewEmployeeDetails?: (employee: Employee) => void;
}

const SuiviIntegrations: React.FC<SuiviIntegrationsProps> = ({ employees, onViewEmployeeDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Employee['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | string>('all');

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

  const getProgressPercentage = (status: Employee['status']) => {
    switch (status) {
      case 'Préparation': return 25;
      case 'Accueil': return 50;
      case 'Prise de service': return 75;
      case 'Complété': return 100;
      default: return 0;
    }
  };

  // Filtrer les employés
  const filteredEmployees = employees.filter(employee => {
    if (!employee) return false;
    
    const matchesSearch = 
      (employee.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Obtenir les départements uniques
  const departments = [...new Set(employees.filter(emp => emp && emp.department).map(emp => emp.department))];

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-xs font-medium text-slate-700">Filtres :</span>
          </div>
          
          {/* Recherche */}
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-slate-500 focus:border-transparent min-w-48"
            />
          </div>

          {/* Filtre statut */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-600">Statut :</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="Préparation">Préparation</option>
              <option value="Accueil">Accueil</option>
              <option value="Prise de service">Prise de service</option>
              <option value="Complété">Complété</option>
            </select>
          </div>

          {/* Filtre département */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-600">Département :</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Total</p>
              <p className="text-xl font-bold text-blue-900">{filteredEmployees.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-700">En cours</p>
              <p className="text-xl font-bold text-yellow-900">
                {filteredEmployees.filter(emp => emp.status !== 'Complété').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">Complétées</p>
              <p className="text-xl font-bold text-green-900">
                {filteredEmployees.filter(emp => emp.status === 'Complété').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-700">Durée moy.</p>
              <p className="text-xl font-bold text-slate-900">
                {filteredEmployees.length > 0 
                  ? Math.round(filteredEmployees.reduce((acc, emp) => acc + getDaysFromStart(emp.createdAt), 0) / filteredEmployees.length)
                  : 0}j
              </p>
            </div>
            <Calendar className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Message si aucun employé */}
      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun employé trouvé</h3>
          <p className="text-sm text-slate-600">
            {employees.length === 0 
              ? "Aucun employé n'a été ajouté pour le moment."
              : "Aucun employé ne correspond aux critères de recherche."
            }
          </p>
        </div>
      )}

      {/* Employees Grid */}
      {filteredEmployees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-xs text-slate-600">{employee.position}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                  {getStatusIcon(employee.status)}
                  <span className="ml-1">{employee.status}</span>
                </span>
              </div>

              {/* Employee Details */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Département:</span>
                  <span className="font-medium text-slate-900">{employee.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Site:</span>
                  <span className="font-medium text-slate-900">{employee.site}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Arrivée:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Durée:</span>
                  <span className="font-medium text-slate-900">{getDaysFromStart(employee.arrivalDate)} jours</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-700">Progression</span>
                  <span className="text-xs text-slate-500">{getProgressPercentage(employee.status)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-700 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(employee.status)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={() => onViewEmployeeDetails && onViewEmployeeDetails(employee)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                >
                  Voir le processus d'intégration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuiviIntegrations;
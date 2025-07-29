import React, { useState } from 'react';
import { 
  Monitor, Smartphone, Laptop, Search, Filter, Plus, Eye, Edit, 
  Trash2, Download, Calendar, User, Package, AlertCircle, CheckCircle,
  FileText, Camera, Printer, Grid3X3, List, Shield
} from 'lucide-react';
import { ITEquipment } from '../types/equipment';

interface ITEquipmentListProps {
  equipment: ITEquipment[];
  onEdit: (equipment: ITEquipment) => void;
  onDelete: (equipmentId: string) => void;
  onAdd: () => void;
}

const ITEquipmentList: React.FC<ITEquipmentListProps> = ({ 
  equipment, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ITEquipment['equipmentType']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ITEquipment['status']>('all');
  const [filterCondition, setFilterCondition] = useState<'all' | ITEquipment['condition']>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtrer les équipements
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.equipmentType === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCondition = filterCondition === 'all' || item.condition === filterCondition;
    
    return matchesSearch && matchesType && matchesStatus && matchesCondition;
  });

  const getEquipmentIcon = (type: ITEquipment['equipmentType']) => {
    switch (type) {
      case 'Ordinateur portable': return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'Ordinateur bureau': return <Monitor className="w-5 h-5 text-green-600" />;
      case 'Téléphone': return <Smartphone className="w-5 h-5 text-purple-600" />;
      case 'Tablette': return <Smartphone className="w-5 h-5 text-orange-600" />;
      case 'Écran': return <Monitor className="w-5 h-5 text-indigo-600" />;
      default: return <Package className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: ITEquipment['status']) => {
    switch (status) {
      case 'Assigné': return 'bg-green-100 text-green-800 border-green-200';
      case 'Retourné': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'En maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Perdu/Volé': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: ITEquipment['status']) => {
    switch (status) {
      case 'Assigné': return <CheckCircle className="w-4 h-4" />;
      case 'Retourné': return <Package className="w-4 h-4" />;
      case 'En maintenance': return <AlertCircle className="w-4 h-4" />;
      case 'Perdu/Volé': return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getConditionColor = (condition: ITEquipment['condition']) => {
    switch (condition) {
      case 'Neuf': return 'bg-green-100 text-green-800 border-green-200';
      case 'Déjà utilisé': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reconditionné': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getWarrantyStatus = (warrantyEndDate?: string) => {
    if (!warrantyEndDate) return null;
    
    const today = new Date();
    const warrantyEnd = new Date(warrantyEndDate);
    const daysUntilExpiry = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', text: 'Expirée', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', text: `${daysUntilExpiry}j restants`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else {
      return { status: 'valid', text: 'Valide', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Employé', 'Type', 'Marque', 'Modèle', 'N° Série', 'État', 'Statut', 'Date Attribution', 'Fin Garantie', 'Attribué par'].join(','),
      ...filteredEquipment.map(item => [
        item.employeeName,
        item.equipmentType,
        item.brand,
        item.model,
        item.serialNumber,
        item.condition,
        item.status,
        new Date(item.assignedDate).toLocaleDateString('fr-FR'),
        item.warrantyEndDate ? new Date(item.warrantyEndDate).toLocaleDateString('fr-FR') : 'N/A',
        item.assignedBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipements-it-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-end space-x-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'table' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Équipement
          </button>
        </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Total</p>
              <p className="text-xl font-bold text-blue-900">{equipment.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">Assignés</p>
              <p className="text-xl font-bold text-green-900">
                {equipment.filter(e => e.status === 'Assigné').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700">Maintenance</p>
              <p className="text-xl font-bold text-orange-900">
                {equipment.filter(e => e.status === 'En maintenance').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-700">Disponibles</p>
              <p className="text-xl font-bold text-slate-900">
                {equipment.filter(e => e.status === 'Retourné').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par employé, marque, modèle, N° série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="Ordinateur portable">Ordinateur portable</option>
              <option value="Ordinateur bureau">Ordinateur bureau</option>
              <option value="Téléphone">Téléphone</option>
              <option value="Tablette">Tablette</option>
              <option value="Écran">Écran</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="Assigné">Assigné</option>
            <option value="Retourné">Retourné</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Perdu/Volé">Perdu/Volé</option>
          </select>

          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les états</option>
            <option value="Neuf">Neuf</option>
            <option value="Déjà utilisé">Déjà utilisé</option>
            <option value="Reconditionné">Reconditionné</option>
          </select>
        </div>
      </div>

      {/* Liste des équipements */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-0">
        {filteredEquipment.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Aucun équipement trouvé</h3>
            <p className="text-sm text-slate-600">
              {equipment.length === 0 
                ? "Aucun équipement n'a été enregistré pour le moment."
                : "Aucun équipement ne correspond aux critères de recherche."
              }
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Équipement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Spécifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    N° Série
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Garantie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Attribution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getEquipmentIcon(item.equipmentType)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {item.brand} {item.model}
                          </div>
                          <div className="text-sm text-slate-500">{item.equipmentType}</div>
                          {item.screenSize && (
                            <div className="text-xs text-slate-400">{item.screenSize}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        <div className="text-sm text-slate-900">{item.employeeName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate" title={item.specifications}>
                        {item.specifications}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-slate-900">{item.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.warrantyEndDate ? (
                        <div>
                          <div className="text-sm text-slate-900">
                            {new Date(item.warrantyEndDate).toLocaleDateString('fr-FR')}
                          </div>
                          {(() => {
                            const warranty = getWarrantyStatus(item.warrantyEndDate);
                            return warranty ? (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${warranty.bgColor} ${warranty.color}`}>
                                {warranty.text}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Non définie</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(item.assignedDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-slate-500">{item.assignedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {item.images.length > 0 && (
                          <button
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title={`${item.images.length} photo(s)`}
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                        {item.dischargeDocument && (
                          <button
                            className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                            title="Décharge signée"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Vue en cartes
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item) => {
                const warranty = getWarrantyStatus(item.warrantyEndDate);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getEquipmentIcon(item.equipmentType)}
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {item.brand} {item.model}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </span>
                    </div>

                    {/* Type et taille */}
                    <div className="mb-3">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        {item.equipmentType}
                      </div>
                      {item.screenSize && (
                        <div className="text-xs text-slate-400">{item.screenSize}</div>
                      )}
                    </div>

                    {/* Employé */}
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-3 h-3 text-slate-400" />
                      <div className="text-xs text-slate-600 truncate">{item.employeeName}</div>
                    </div>

                    {/* Numéro de série */}
                    <div className="mb-3">
                      <div className="text-xs text-slate-500">N° Série</div>
                      <div className="text-xs font-mono text-slate-900 truncate">{item.serialNumber}</div>
                    </div>

                    {/* État et garantie */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                      {warranty && (
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-slate-400" />
                          <span className={`text-xs px-2 py-0.5 rounded-full ${warranty.bgColor} ${warranty.color}`}>
                            {warranty.text}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date d'attribution */}
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Attribution</div>
                      <div className="text-xs text-slate-900">
                        {new Date(item.assignedDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-slate-500">{item.assignedBy}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        {item.images.length > 0 && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Camera className="w-3 h-3" />
                            <span className="text-xs">{item.images.length}</span>
                          </div>
                        )}
                        {item.dischargeDocument && (
                          <div className="text-purple-600">
                            <FileText className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITEquipmentList;
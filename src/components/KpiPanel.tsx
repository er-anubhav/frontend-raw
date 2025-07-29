import React from 'react';
import { TrendingUp, Clock, CheckCircle, Calendar } from 'lucide-react';
import { KPI } from '../types';

interface KpiPanelProps {
  kpi: KPI;
}

const KpiPanel: React.FC<KpiPanelProps> = ({ kpi }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      <div className="p-4 rounded-2xl border" style={{background: 'linear-gradient(to bottom right, #f0fdfd, #e6ffff)', borderColor: '#b3f0f0'}}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium" style={{color: '#065a5d'}}>Cette semaine</p>
            <p className="text-xl font-bold" style={{color: '#044d50'}}>{kpi.integrationsThisWeek}</p>
          </div>
          <TrendingUp className="w-8 h-8" style={{color: '#077A7D'}} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-red-700">En retard</p>
            <p className="text-xl font-bold text-red-900">{kpi.integrationsOverdue}</p>
          </div>
          <Clock className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-green-700">Complétées</p>
            <p className="text-xl font-bold text-green-900">{kpi.integrationsCompleted}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-700">Durée moy.</p>
            <p className="text-xl font-bold text-slate-900">{kpi.averageDuration}j</p>
          </div>
          <Calendar className="w-8 h-8 text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default KpiPanel;
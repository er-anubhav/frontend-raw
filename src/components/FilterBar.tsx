import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { uiActions } from '../features/ui/uiSlice';
import { Filter, Calendar } from 'lucide-react';

const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.ui);

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 w-full">
      <div className="flex items-center space-x-4 overflow-x-auto">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <span className="text-xs font-medium text-slate-700 whitespace-nowrap">Filtres :</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-600 whitespace-nowrap">Département:</label>
          <select
            value={filters.department}
            onChange={(e) => dispatch(uiActions.setFilters({ ...filters, department: e.target.value as any }))}
            className="border border-slate-300 rounded-lg px-2 py-1 text-xs min-w-0"
            style={{'&:focus': {outline: 'none', borderColor: '#077A7D', boxShadow: '0 0 0 2px rgba(7, 122, 125, 0.1)'}}}
          >
            <option value="Tous">Tous les départements</option>
            <option value="Mine">Mine</option>
            <option value="Services Généraux">Services Généraux</option>
            <option value="Usines">Usines</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Camp">Camp</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <label className="text-xs text-slate-600 whitespace-nowrap">Période:</label>
          <div className="flex space-x-1">
            {(['Cette semaine', 'Semaine dernière', 'Ce mois', 'Mois dernier'] as const).map((timeframe) => (
              <label key={timeframe} className="flex items-center">
                <input
                  type="radio"
                  name="timeframe"
                  value={timeframe}
                  checked={filters.timeframe === timeframe}
                  onChange={(e) => dispatch(uiActions.setFilters({ ...filters, timeframe: e.target.value as any }))}
                  className="sr-only"
                />
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                    filters.timeframe === timeframe
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } whitespace-nowrap min-w-0`}
                  style={filters.timeframe === timeframe ? {backgroundColor: '#077A7D'} : {}}
                >
                  {timeframe}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Employee, FilterOptions } from '../types';

interface DashboardChartsProps {
  employees: Employee[];
  filters: FilterOptions;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ employees, filters }) => {
  // Couleurs pour les graphiques
  const COLORS = {
    'Préparation': '#f59e0b', // Garde l'orange pour préparation
    'Accueil': '#077A7D', // Utilise le teal principal
    'Prise de service': '#f97316',
    'Complété': '#10b981'
  };

  const PIE_COLORS = ['#f59e0b', '#077A7D', '#f97316', '#10b981'];

  // Générer les données pour l'histogramme mensuel (année à date)
  const generateMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Données fictives réalistes pour l'année 2024
    const monthlyData = [
      { mois: 'Jan', onboardings: 6 },
      { mois: 'Fév', onboardings: 4 },
      { mois: 'Mar', onboardings: 3 },
      { mois: 'Avr', onboardings: 2 },
      { mois: 'Mai', onboardings: 2 },
      { mois: 'Jun', onboardings: 2 },
      { mois: 'Jul', onboardings: 1 },
      { mois: 'Aoû', onboardings: 2 },
      { mois: 'Sep', onboardings: 1 },
      { mois: 'Oct', onboardings: 1 },
      { mois: 'Nov', onboardings: 3 },
      { mois: 'Déc', onboardings: 4 }
    ];
    
    return monthlyData;
  };

  // Générer les données pour le pie chart des statuts
  const generateStatusData = () => {
    // Données fictives réalistes pour les statuts
    const statusData = [
      { name: 'Préparation', value: 8, percentage: 31 },
      { name: 'Accueil', value: 6, percentage: 23 },
      { name: 'Prise de service', value: 6, percentage: 23 },
      { name: 'Complété', value: 6, percentage: 23 }
    ];
    
    return statusData;
  };

  const monthlyData = generateMonthlyData();
  const statusData = generateStatusData();

  // Custom tooltip pour l'histogramme
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{`${label} ${new Date().getFullYear()}`}</p>
          <p style={{color: '#077A7D'}}>
            {`Onboardings: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip pour le pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.name}</p>
          <p className="text-slate-600">
            {`${data.value} employé${data.value > 1 ? 's' : ''} (${data.percentage}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label pour le pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Ne pas afficher les labels pour les petites sections
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Histogramme des onboardings par mois */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-900">
            Onboardings par Mois ({new Date().getFullYear()})
          </h3>
          <p className="text-xs text-slate-600">
            Évolution mensuelle des arrivées depuis le début de l'année
          </p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="mois" 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="onboardings" 
                fill="#077A7D"
                radius={[4, 4, 0, 0]}
                name="Onboardings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart des statuts */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-900">
            Répartition par Statut
          </h3>
          <p className="text-xs text-slate-600">
            Distribution des employés selon leur statut d'onboarding
            {filters.timeframe !== 'Cette semaine' && ` (${filters.timeframe})`}
            {filters.department !== 'Tous' && ` - ${filters.department}`}
          </p>
        </div>

        {statusData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || PIE_COLORS[index % PIE_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }} className="text-xs">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-slate-900 mb-2">Aucune donnée</h3>
              <p className="text-sm text-slate-600">
                Aucun employé trouvé pour la période et les filtres sélectionnés.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
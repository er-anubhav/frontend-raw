import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { uiActions } from '../features/ui/uiSlice';
import { 
  Users, UserPlus, TrendingUp, Settings, Bell, UserCheck, ClipboardList,
  ChevronDown, ChevronRight, BarChart3, Eye, Calendar, Monitor, Menu,
  X, User, LogOut, Settings as SettingsIcon
} from 'lucide-react';

type ViewType = 'dashboard' | 'new-onboarding' | 'suivi' | 'notifications' | 'responsables' | 'planning' | 'checklists' | 'equipment' | 'checklist-detail';

interface MenuGroup {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: {
    id: ViewType;
    title: string;
    icon: React.ComponentType<any>;
  }[];
}

interface DirectMenuItem {
  id: ViewType;
  title: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentView, expandedGroups } = useAppSelector((state) => state.ui);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Menu direct (sans groupe)
  const directMenuItems: DirectMenuItem[] = [
    {
      id: 'dashboard',
      title: 'Tableau de Bord',
      icon: TrendingUp
    }
  ];

  const menuGroups: MenuGroup[] = [
    {
      id: 'gestion-des-arrivees',
      title: 'Gestion des Arrivées',
      icon: UserCheck,
      items: [
        {
          id: 'new-onboarding', 
          title: 'Gestion des Accueils',
          icon: UserPlus
        },
        {
          id: 'notifications',
          title: 'Notifications d\'Arrivée',
          icon: Bell
        },
        {
         id: 'suivi',
         title: 'Suivi Intégrations',
         icon: Eye
       },
       {
          id: 'equipment',
          title: 'Équipements IT',
          icon: Monitor
        }
      ]
    },
    {
      id: 'parametrage',
      title: 'Paramétrage',
      icon: Settings,
      items: [
        {
          id: 'responsables',
          title: 'Responsables',
          icon: Users
        },
        {
          id: 'planning',
          title: 'Planification',
          icon: Calendar
        },
        {
          id: 'checklists',
          title: 'Checklists',
          icon: ClipboardList
        }
      ]
    }
  ];

  const handleMenuItemClick = (viewId: ViewType) => {
    dispatch(uiActions.setCurrentView(viewId));
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tableau de Bord';
      case 'suivi': return 'Suivi des Intégrations';
      case 'new-onboarding': return 'Gestion des Accueils';
      case 'notifications': return 'Notifications d\'Arrivée';
      case 'responsables': return 'Responsables';
      case 'planning': return 'Planification';
      case 'checklists': return 'Checklists';
      case 'equipment': return 'Équipements IT';
      default: return 'Tableau de Bord';
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case 'dashboard': return 'Vue globale du Processus d\'Intégration';
      case 'new-onboarding': return 'Planification des Accueils';
      case 'suivi': return 'Suivi détaillé de tous les employés';
      case 'notifications': return 'Notifications d\'arrivée automatiques avec génération PDF';
      case 'responsables': return 'Gestion des responsables par département';
      case 'planning': return 'Génération de planning d\'accueil';
      case 'checklists': return 'Administration des listes de contrôle d\'onboarding';
      case 'equipment': return 'Gestion et attribution des équipements informatiques';
      default: return 'Vue globale du Processus d\'Intégration';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden">
      {/* Menu Vertical */}
      <div className={`${isMenuCollapsed ? 'w-16' : 'w-64'} shadow-lg border-r flex flex-col transition-all duration-300 flex-shrink-0 bg-white border-slate-200`}>
        {/* Header du menu */}
        <div className="p-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-full">
              <img 
                src="/OnBoarding Logo.png" 
                className={`object-contain ${isMenuCollapsed ? 'w-full h-12' : 'w-full h-16'}`}
              />
            </div>
            <button
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-100 absolute top-2 right-2"
            >
              {isMenuCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden bg-slate-50">
          <div className="space-y-2">
            {/* Menu direct - Tableau de Bord */}
            {directMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center ${isMenuCollapsed ? 'justify-center' : 'justify-start'} p-2 text-left rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-teal-100 text-teal-800 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title={isMenuCollapsed ? item.title : ''}
              >
                <item.icon className="w-5 h-5" />
                {!isMenuCollapsed && (
                  <span className="ml-3 text-xs font-medium whitespace-nowrap">{item.title}</span>
                )}
              </button>
            ))}
            
            {/* Séparateur */}
            {!isMenuCollapsed && <div className="border-t my-3 border-slate-200"></div>}
            
            {/* Groupes de menu */}
            {menuGroups.map((group) => (
              <div key={group.id} className="mb-4">
                {/* En-tête de groupe */}
                <button
                  onClick={() => dispatch(uiActions.toggleGroup(group.id))}
                  className={`w-full flex items-center ${isMenuCollapsed ? 'justify-center' : 'justify-between'} p-2 text-left text-slate-600 hover:bg-slate-100 rounded-lg transition-colors`}
                  title={isMenuCollapsed ? group.title : ''}
                >
                  <div className="flex items-center space-x-3">
                    <group.icon className="w-5 h-5" />
                    {!isMenuCollapsed && <span className="text-xs font-medium whitespace-nowrap">{group.title}</span>}
                  </div>
                  {!isMenuCollapsed && (expandedGroups.includes(group.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  ))}
                </button>

                {/* Items du groupe */}
                {expandedGroups.includes(group.id) && !isMenuCollapsed && (
                  <div className="ml-3 mt-1 space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={`w-full flex items-start space-x-2 p-2 text-left rounded-lg transition-colors ${
                          currentView === item.id
                            ? 'bg-teal-100 text-teal-800 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isMenuCollapsed ? item.title : ''}
                      >
                        <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {!isMenuCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium whitespace-nowrap">{item.title}</div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Items du groupe en mode collapsed */}
                {isMenuCollapsed && (
                  <div className="mt-1 space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                          currentView === item.id
                            ? 'bg-teal-100 text-teal-800 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title={item.title}
                      >
                        <item.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer du menu */}
        {!isMenuCollapsed && (
          <div className="p-3 border-t border-slate-200 bg-slate-100">
            <div className="text-xs text-slate-500 text-center">
              Version 1.0.0 - Système Minier
            </div>
          </div>
        )}
      </div>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Bannière colorée */}
        <div className="text-slate-700 py-1 px-4 shadow-sm backdrop-blur-sm flex-shrink-0 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Accueil et Intégration</h1>
                <p className="text-xs text-green-800 mt-0.5">Gestion de l'accueil et du processus d'intégration des nouveaux employés</p>
              </div>
            </div>
            
            {/* User Info Section */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-60 rounded-lg transition-colors border border-slate-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)'}
              >
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-800">Admin Système</div>
                  <div className="text-xs text-slate-600">admin@mine.com</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button className="w-full px-3 py-1 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 text-xs">
                    <SettingsIcon className="w-4 h-4" />
                    <span>Paramètres</span>
                  </button>
                  <hr className="my-0.5 border-slate-200" />
                  <button className="w-full px-3 py-1 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 text-xs">
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Header Principal */}

        {/* Contenu */}
        <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      
      {/* Overlay pour fermer le menu utilisateur */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppSelector';
import uiSlice from '../features/ui/uiSlice';
import { 
  Mail, Send, Clock, CheckCircle, AlertCircle, Filter, Calendar, User, 
  MessageSquare, Plus, Eye, Trash2, RefreshCw, FileText, Download,
  Users, Monitor, Shield, Check, ArrowLeft, X
} from 'lucide-react';
import { Notification, Employee, DEFAULT_CHECKLIST_ITEMS } from '../types';

interface SelectedEmployee {
  employee: Employee;
  tasks: {
    RH: string[];
    IT: string[];
    'Sécurité': string[];
  };
}

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // États pour la création de notification
  const [notificationType, setNotificationType] = useState<'weekly' | 'tomorrow' | 'custom'>('weekly');
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<('RH' | 'IT' | 'Sécurité')[]>(['RH', 'IT', 'Sécurité']);

  // Charger les notifications depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mining-notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      initializeSampleNotifications();
    }
  }, []);

  // Sauvegarder les notifications
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('mining-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const initializeSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        subject: 'Arrivées de la semaine - 3 nouveaux employés',
        message: 'Voici la liste des employés arrivant cette semaine avec leurs tâches assignées.',
        recipients: ['marie.dubois@mine.com', 'jean.martin@mine.com', 'pierre.lefebvre@mine.com'],
        sentAt: '2024-01-15T08:00:00Z',
        type: 'info',
        status: 'sent'
      },
      {
        id: '2',
        subject: 'Arrivée demain - Alexandre Tremblay',
        message: 'Alexandre Tremblay arrive demain. Veuillez préparer les tâches d\'onboarding.',
        recipients: ['marie.dubois@mine.com'],
        sentAt: '2024-01-14T16:30:00Z',
        type: 'warning',
        status: 'sent'
      }
    ];
    setNotifications(sampleNotifications);
  };

  // Filtrer les employés selon le type de notification
  const getFilteredEmployees = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lundi
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

    return employees.filter(emp => {
      const arrivalDate = new Date(emp.arrivalDate);
      
      switch (notificationType) {
        case 'weekly':
          return arrivalDate >= startOfWeek && arrivalDate <= endOfWeek;
        case 'tomorrow':
          return arrivalDate.toDateString() === tomorrow.toDateString();
        case 'custom':
          return emp.status !== 'Complété';
        default:
          return false;
      }
    });
  };

  // Gérer la sélection d'employés
  const handleEmployeeSelection = (employee: Employee, selected: boolean) => {
    if (selected) {
      const newSelectedEmployee: SelectedEmployee = {
        employee,
        tasks: {
          RH: DEFAULT_CHECKLIST_ITEMS.filter(t => t.responsible === 'RH').map(t => t.id),
          IT: DEFAULT_CHECKLIST_ITEMS.filter(t => t.responsible === 'IT').map(t => t.id),
          'Sécurité': DEFAULT_CHECKLIST_ITEMS.filter(t => t.responsible === 'Sécurité').map(t => t.id)
        }
      };
      setSelectedEmployees(prev => [...prev, newSelectedEmployee]);
    } else {
      setSelectedEmployees(prev => prev.filter(sel => sel.employee.id !== employee.id));
    }
  };

  // Gérer la sélection de tâches pour un employé
  const handleTaskSelection = (employeeId: string, department: 'RH' | 'IT' | 'Sécurité', taskId: string, selected: boolean) => {
    setSelectedEmployees(prev => prev.map(sel => {
      if (sel.employee.id === employeeId) {
        return {
          ...sel,
          tasks: {
            ...sel.tasks,
            [department]: selected 
              ? [...sel.tasks[department], taskId]
              : sel.tasks[department].filter(id => id !== taskId)
          }
        };
      }
      return sel;
    }));
  };

  // Générer le contenu PDF pour un employé
  const generatePDFContent = (selectedEmp: SelectedEmployee) => {
    const { employee, tasks } = selectedEmp;
    
    let pdfContent = `
=== MATRICE D'ONBOARDING ===
Employé: ${employee.firstName} ${employee.lastName}
Poste: ${employee.position}
Département: ${employee.department}
Site: ${employee.site}
Date d'arrivée: ${new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}

=== TÂCHES PAR DÉPARTEMENT ===

`;

    (['RH', 'IT', 'Sécurité'] as const).forEach(dept => {
      if (selectedDepartments.includes(dept)) {
        pdfContent += `\n--- DÉPARTEMENT ${dept} ---\n`;
        const deptTasks = DEFAULT_CHECKLIST_ITEMS.filter(t => t.responsible === dept);
        
        deptTasks.forEach(task => {
          const isSelected = tasks[dept].includes(task.id);
          pdfContent += `${isSelected ? '☑' : '☐'} ${task.title}\n`;
          pdfContent += `   Description: ${task.description}\n`;
          pdfContent += `   Durée estimée: ${task.estimatedDuration}h\n`;
          pdfContent += `   ${task.mandatory ? '⚠️ OBLIGATOIRE' : '📋 Optionnel'}\n`;
          pdfContent += `   Catégorie: ${task.category || 'Général'}\n\n`;
        });
      }
    });

    pdfContent += `\n=== RESPONSABLES ===\n`;
    pdfContent += `RH: ${employee.hrResponsible}\n`;
    pdfContent += `IT: ${employee.itResponsible}\n`;
    pdfContent += `Sécurité: ${employee.securityResponsible}\n`;

    pdfContent += `\n=== INFORMATIONS COMPLÉMENTAIRES ===\n`;
    pdfContent += `EPI requis: ${employee.requiredPPE || 'Non spécifié'}\n`;
    pdfContent += `Formation planifiée: ${employee.plannedTraining || 'Non spécifiée'}\n`;
    pdfContent += `Commentaires: ${employee.additionalComments || 'Aucun'}\n`;

    return pdfContent;
  };

  // Télécharger le PDF pour un employé
  const downloadPDF = (selectedEmp: SelectedEmployee) => {
    const content = generatePDFContent(selectedEmp);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matrice-onboarding-${selectedEmp.employee.firstName}-${selectedEmp.employee.lastName}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Télécharger le PDF depuis l'historique
  const downloadPDFFromHistory = (notification: Notification) => {
    // Simuler le téléchargement d'un PDF depuis l'historique
    const content = `
=== NOTIFICATION D'ARRIVÉE ===
Sujet: ${notification.subject}
Date d'envoi: ${new Date(notification.sentAt).toLocaleDateString('fr-FR')}

Message:
${notification.message}

Destinataires:
${notification.recipients.map(email => `- ${email}`).join('\n')}

=== MATRICES D'ONBOARDING JOINTES ===
(Ce fichier simule les PDFs générés pour chaque employé mentionné dans la notification)
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notification-${notification.id}-matrices.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Envoyer les notifications
  const handleSendNotifications = () => {
    if (selectedEmployees.length === 0) return;

    const getSubject = () => {
      switch (notificationType) {
        case 'weekly':
          return `Arrivées de la semaine - ${selectedEmployees.length} employé(s)`;
        case 'tomorrow':
          return `Arrivée demain - ${selectedEmployees.map(s => s.employee.firstName + ' ' + s.employee.lastName).join(', ')}`;
        case 'custom':
          return `Notification personnalisée - ${selectedEmployees.length} employé(s)`;
        default:
          return 'Notification onboarding';
      }
    };

    const getMessage = () => {
      let message = customMessage || '';
      
      switch (notificationType) {
        case 'weekly':
          message += '\n\nEmployés arrivant cette semaine:\n';
          break;
        case 'tomorrow':
          message += '\n\nEmployés arrivant demain:\n';
          break;
        case 'custom':
          message += '\n\nEmployés concernés:\n';
          break;
      }

      selectedEmployees.forEach(sel => {
        message += `\n• ${sel.employee.firstName} ${sel.employee.lastName} - ${sel.employee.position}`;
        message += `\n  Arrivée: ${new Date(sel.employee.arrivalDate).toLocaleDateString('fr-FR')}`;
        message += `\n  Département: ${sel.employee.department} - Site: ${sel.employee.site}`;
        
        selectedDepartments.forEach(dept => {
          const taskCount = sel.tasks[dept].length;
          if (taskCount > 0) {
            message += `\n  ${dept}: ${taskCount} tâche(s) assignée(s)`;
          }
        });
        message += '\n';
      });

      message += '\n📎 Les matrices détaillées d\'onboarding sont jointes en PDF pour chaque employé.';
      message += '\n\nCordialement,\nSystème d\'Onboarding Automatique';
      return message;
    };

    // Créer les destinataires selon les départements sélectionnés
    const recipients: string[] = [];
    if (selectedDepartments.includes('RH')) recipients.push('marie.dubois@mine.com');
    if (selectedDepartments.includes('IT')) recipients.push('jean.martin@mine.com');
    if (selectedDepartments.includes('Sécurité')) recipients.push('pierre.lefebvre@mine.com');

    const notification: Notification = {
      id: Date.now().toString(),
      subject: getSubject(),
      message: getMessage(),
      recipients,
      sentAt: new Date().toISOString(),
      type: notificationType === 'tomorrow' ? 'warning' : 'info',
      status: 'sent'
    };

    setNotifications(prev => [notification, ...prev]);
    
    // Générer les PDFs pour chaque employé sélectionné
    selectedEmployees.forEach(sel => {
      setTimeout(() => downloadPDF(sel), 500);
    });

    // Reset et fermer le formulaire
    setSelectedEmployees([]);
    setCustomMessage('');
    setShowCreateForm(false);
    
    alert(`✅ Notification envoyée à ${recipients.length} responsable(s) avec ${selectedEmployees.length} PDF(s) générés !`);
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.status === filter);
  };

  const getStatusIcon = (status: Notification['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getDepartmentIcon = (dept: 'RH' | 'IT' | 'Sécurité') => {
    switch (dept) {
      case 'RH': return <Users className="w-4 h-4" />;
      case 'IT': return <Monitor className="w-4 h-4" />;
      case 'Sécurité': return <Shield className="w-4 h-4" />;
    }
  };

  const getDepartmentColor = (dept: 'RH' | 'IT' | 'Sécurité') => {
    switch (dept) {
      case 'RH': return 'blue';
      case 'IT': return 'purple';
      case 'Sécurité': return 'red';
    }
  };

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Titre de la page */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notifications d'Arrivée</h1>
        <p className="text-sm text-slate-600 mt-1">Notifications automatiques avec génération PDF</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div></div>
        
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Notification
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
        <div className="flex h-[calc(100vh-300px)]">
          {showCreateForm ? (
            // Interface de création de notification
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Type de notification */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="p-4 rounded-xl" style={{backgroundColor: '#f0fdfd'}}>
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Type de notification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors" style={{'&:hover': {backgroundColor: '#e6ffff'}}}>
                      <input
                        type="radio"
                        name="notificationType"
                        value="weekly"
                        checked={notificationType === 'weekly'}
                        onChange={(e) => setNotificationType(e.target.value as any)}
                        style={{accentColor: '#077A7D'}}
                      />
                      <div>
                        <div className="font-medium text-xs">Arrivées de la semaine</div>
                        <div className="text-xs text-slate-600">Employés arrivant cette semaine</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors" style={{'&:hover': {backgroundColor: '#fff7ed'}}}>
                      <input
                        type="radio"
                        name="notificationType"
                        value="tomorrow"
                        checked={notificationType === 'tomorrow'}
                        onChange={(e) => setNotificationType(e.target.value as any)}
                        className="text-orange-600"
                      />
                      <div>
                        <div className="font-medium text-xs">Arrivée demain</div>
                        <div className="text-xs text-slate-600">Employés arrivant demain</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors" style={{'&:hover': {backgroundColor: '#f0fdf4'}}}>
                      <input
                        type="radio"
                        name="notificationType"
                        value="custom"
                        checked={notificationType === 'custom'}
                        onChange={(e) => setNotificationType(e.target.value as any)}
                        className="text-green-600"
                      />
                      <div>
                        <div className="font-medium text-xs">Personnalisée</div>
                        <div className="text-xs text-slate-600">Sélection manuelle</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Départements destinataires */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-4">Départements destinataires</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['RH', 'IT', 'Sécurité'] as const).map(dept => (
                    <label key={dept} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments(prev => [...prev, dept]);
                          } else {
                            setSelectedDepartments(prev => prev.filter(d => d !== dept));
                          }
                        }}
                        className={`text-${getDepartmentColor(dept)}-600`}
                      />
                      <div className="flex items-center space-x-2">
                        {getDepartmentIcon(dept)}
                        <span className="font-medium">{dept}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message personnalisé */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message personnalisé (optionnel)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  style={{'&:focus': {outline: 'none', borderColor: '#077A7D', boxShadow: '0 0 0 3px rgba(7, 122, 125, 0.1)'}}}
                  rows={3}
                  placeholder="Message d'introduction ou instructions spéciales..."
                />
              </div>

              {/* Sélection des employés */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">
                  Employés concernés ({getFilteredEmployees().length} disponible(s))
                </h3>
                
                {getFilteredEmployees().length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>Aucun employé trouvé pour ce type de notification</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredEmployees().map(employee => {
                      const isSelected = selectedEmployees.some(sel => sel.employee.id === employee.id);
                      const selectedEmp = selectedEmployees.find(sel => sel.employee.id === employee.id);
                      
                      return (
                        <div key={employee.id} className="border border-slate-200 rounded-lg overflow-hidden">
                          <div className="p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => handleEmployeeSelection(employee, e.target.checked)}
                                  style={{accentColor: '#077A7D'}}
                                />
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {employee.firstName} {employee.lastName}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {employee.position} - {employee.department}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Arrivée: {new Date(employee.arrivalDate).toLocaleDateString('fr-FR')}
                                  </div>
                                </div>
                              </label>
                              
                              {isSelected && (
                                <button
                                  onClick={() => downloadPDF(selectedEmp!)}
                                  className="inline-flex items-center px-3 py-1 rounded-lg transition-colors"
                                  style={{backgroundColor: '#f0fdfd', color: '#077A7D'}}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6ffff'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0fdfd'}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Aperçu PDF
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Interface de sélection des tâches */}
                          {isSelected && selectedEmp && (
                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                              <h4 className="font-medium text-slate-900 mb-3">Tâches à inclure:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(['RH', 'IT', 'Sécurité'] as const).map(dept => {
                                  if (!selectedDepartments.includes(dept)) return null;
                                  
                                  const deptTasks = DEFAULT_CHECKLIST_ITEMS.filter(t => t.responsible === dept);
                                  
                                  return (
                                    <div key={dept} className="space-y-2">
                                      <h5 className={`font-medium flex items-center space-x-1 ${
                                        dept === 'RH' ? 'text-blue-700' :
                                        dept === 'IT' ? 'text-purple-700' :
                                        'text-red-700'
                                      }`}>
                                        {getDepartmentIcon(dept)}
                                        <span>{dept}</span>
                                      </h5>
                                      <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {deptTasks.map(task => (
                                          <label key={task.id} className="flex items-start space-x-2 text-xs">
                                            <input
                                              type="checkbox"
                                              checked={selectedEmp.tasks[dept].includes(task.id)}
                                              onChange={(e) => handleTaskSelection(employee.id, dept, task.id, e.target.checked)}
                                              className={`mt-0.5 ${
                                                dept === 'RH' ? 'text-blue-600' :
                                                dept === 'IT' ? 'text-purple-600' :
                                                'text-red-600'
                                              }`}
                                              style={{accentColor: 
                                                dept === 'RH' ? '#2563eb' :
                                                dept === 'IT' ? '#9333ea' :
                                                '#dc2626'
                                              }}
                                            />
                                            <div className="flex-1">
                                              <span className="font-medium">{task.title}</span>
                                              {task.mandatory && (
                                                <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                                  Obligatoire
                                                </span>
                                              )}
                                            </div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSelectedEmployees([]);
                    setCustomMessage('');
                    setShowCreateForm(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendNotifications}
                  disabled={selectedEmployees.length === 0 || selectedDepartments.length === 0}
                  className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-sm"
                  style={{backgroundColor: '#077A7D'}}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#065a5d')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#077A7D')}
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ({selectedEmployees.length} employé(s))</span>
                </button>
              </div>
            </div>
          ) : (
            // Liste des notifications existantes
            <>
              {/* Liste des notifications */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as any)}
                          className="border border-slate-300 rounded-md px-3 py-1 text-sm"
                        >
                          <option value="all">Toutes</option>
                          <option value="sent">Envoyées</option>
                          <option value="pending">En attente</option>
                          <option value="failed">Échec</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {getFilteredNotifications().length} notification(s)
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {getFilteredNotifications().map(notification => (
                      <div
                        key={notification.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedNotification?.id === notification.id
                            ? 'border-slate-400 bg-slate-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedNotification(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-slate-900 text-sm">{notification.subject}</h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(notification.status)}`}>
                                {getStatusIcon(notification.status)}
                                <span className="ml-1 capitalize">{notification.status}</span>
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(notification.sentAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{notification.recipients.length} destinataire(s)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPDFFromHistory(notification);
                              }}
                              className="p-1 transition-colors"
                              style={{color: '#077A7D'}}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#065a5d'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#077A7D'}
                              title="Télécharger les matrices PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {getFilteredNotifications().length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-base font-semibold text-slate-900 mb-2">Aucune notification trouvée</h3>
                      <p className="text-sm text-slate-600">
                        {notifications.length === 0 
                          ? "Aucune notification n'a été envoyée pour le moment."
                          : "Aucune notification ne correspond aux critères de filtrage."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panneau de détail à droite */}
              {selectedNotification && (
                <div className="w-96 border-l border-slate-200 bg-slate-50">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Détails de la notification</h3>
                      <button
                        onClick={() => setSelectedNotification(null)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sujet</label>
                      <p className="text-sm text-slate-900">{selectedNotification.subject}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                      <p className="text-sm text-slate-900 bg-white p-3 rounded border whitespace-pre-line">
                        {selectedNotification.message}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Destinataires</label>
                      <div className="space-y-1">
                        {selectedNotification.recipients.map((recipient, index) => (
                          <p key={index} className="text-sm text-slate-600">{recipient}</p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date d'envoi</label>
                      <p className="text-sm text-slate-900">
                        {new Date(selectedNotification.sentAt).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <button
                        onClick={() => downloadPDFFromHistory(selectedNotification)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-white rounded-lg transition-colors"
                        style={{backgroundColor: '#077A7D'}}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#065a5d'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#077A7D'}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Télécharger les matrices PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
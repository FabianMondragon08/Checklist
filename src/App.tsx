import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { Dashboard } from './components/Dashboard';
import { InspectionForm } from './components/InspectionForm';
import { WorkPermitForm } from './components/WorkPermitForm';
import { History } from './components/History';
import { Inspection, WorkPermit } from './types';
import { LogOut, Users, Home } from 'lucide-react';

type AppState = 
  | { view: 'dashboard' }
  | { view: 'inspection'; datacenter: 'DC1' | 'DC2'; shift: 'morning' | 'afternoon' }
  | { view: 'workPermit' }
  | { view: 'history' }
  | { view: 'users' };

const AppContent: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>({ view: 'dashboard' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  const handleNewInspection = (datacenter: 'DC1' | 'DC2', shift: 'morning' | 'afternoon') => {
    setAppState({ view: 'inspection', datacenter, shift });
  };

  const handleNewWorkPermit = () => {
    setAppState({ view: 'workPermit' });
  };

  const handleViewHistory = () => {
    setAppState({ view: 'history' });
  };

  const handleViewUsers = () => {
    setAppState({ view: 'users' });
  };

  const handleBack = () => {
    setAppState({ view: 'dashboard' });
  };

  const handleSaveInspection = (inspection: Inspection) => {
    const existingInspections: Inspection[] = JSON.parse(localStorage.getItem('inspections') || '[]');
    const updatedInspections = [...existingInspections, inspection];
    localStorage.setItem('inspections', JSON.stringify(updatedInspections));
    
    alert('Inspección guardada exitosamente');
    setAppState({ view: 'dashboard' });
  };

  const handleSaveWorkPermit = (workPermit: WorkPermit) => {
    const existingPermits: WorkPermit[] = JSON.parse(localStorage.getItem('workPermits') || '[]');
    const updatedPermits = [...existingPermits, workPermit];
    localStorage.setItem('workPermits', JSON.stringify(updatedPermits));
    
    alert('Permiso de trabajo guardado exitosamente');
    setAppState({ view: 'dashboard' });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Header with navigation
  const renderHeader = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setAppState({ view: 'dashboard' })}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                appState.view === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            {profile.role === 'superadmin' && (
              <button
                onClick={handleViewUsers}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  appState.view === 'users' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{profile.full_name || 'Usuario'}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {profile.role === 'superadmin' ? 'Super Admin' :
                 profile.role === 'admin' ? 'Admin' :
                 profile.role === 'supervisor' ? 'Supervisor' : 'Inspector'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (appState.view) {
    case 'dashboard':
      return (
        <div>
          {renderHeader()}
          <Dashboard
            onNewInspection={handleNewInspection}
            onNewWorkPermit={handleNewWorkPermit}
            onViewHistory={handleViewHistory}
          />
        </div>
      );
    case 'inspection':
      return (
        <div>
          {renderHeader()}
          <InspectionForm
            datacenter={appState.datacenter}
            shift={appState.shift}
            onBack={handleBack}
            onSave={handleSaveInspection}
          />
        </div>
      );
    case 'workPermit':
      return (
        <div>
          {renderHeader()}
          <WorkPermitForm
            onBack={handleBack}
            onSave={handleSaveWorkPermit}
          />
        </div>
      );
    case 'history':
      return (
        <div>
          {renderHeader()}
          <History onBack={handleBack} />
        </div>
      );
    case 'users':
      return (
        <div>
          {renderHeader()}
          <UserManagement />
        </div>
      );
    default:
      return (
        <div>
          {renderHeader()}
          <Dashboard
            onNewInspection={handleNewInspection}
            onNewWorkPermit={handleNewWorkPermit}
            onViewHistory={handleViewHistory}
          />
        </div>
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { InspectionForm } from './components/InspectionForm';
import { WorkPermitForm } from './components/WorkPermitForm';
import { History } from './components/History';
import { Inspection, WorkPermit } from './types';

type AppState = 
  | { view: 'dashboard' }
  | { view: 'inspection'; datacenter: 'DC1' | 'DC2'; shift: 'morning' | 'afternoon' }
  | { view: 'workPermit' }
  | { view: 'history' };

function App() {
  const [appState, setAppState] = useState<AppState>({ view: 'dashboard' });

  const handleNewInspection = (datacenter: 'DC1' | 'DC2', shift: 'morning' | 'afternoon') => {
    setAppState({ view: 'inspection', datacenter, shift });
  };

  const handleNewWorkPermit = () => {
    setAppState({ view: 'workPermit' });
  };

  const handleViewHistory = () => {
    setAppState({ view: 'history' });
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

  switch (appState.view) {
    case 'dashboard':
      return (
        <Dashboard
          onNewInspection={handleNewInspection}
          onNewWorkPermit={handleNewWorkPermit}
          onViewHistory={handleViewHistory}
        />
      );
    case 'inspection':
      return (
        <InspectionForm
          datacenter={appState.datacenter}
          shift={appState.shift}
          onBack={handleBack}
          onSave={handleSaveInspection}
        />
      );
    case 'workPermit':
      return (
        <WorkPermitForm
          onBack={handleBack}
          onSave={handleSaveWorkPermit}
        />
      );
    case 'history':
      return (
        <History onBack={handleBack} />
      );
    default:
      return (
        <Dashboard
          onNewInspection={handleNewInspection}
          onNewWorkPermit={handleNewWorkPermit}
          onViewHistory={handleViewHistory}
        />
      );
  }
}

export default App;
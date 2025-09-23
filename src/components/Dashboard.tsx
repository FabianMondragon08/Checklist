import React, { useState, useEffect } from 'react';
import { CheckSquare, FileText, History, Plus } from 'lucide-react';
import { Inspection, WorkPermit } from '../types';

interface DashboardProps {
  onNewInspection: (datacenter: 'DC1' | 'DC2', shift: 'morning' | 'afternoon') => void;
  onNewWorkPermit: () => void;
  onViewHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewInspection,
  onNewWorkPermit,
  onViewHistory
}) => {
  const [todayStats, setTodayStats] = useState({
    dc1Morning: false,
    dc1Afternoon: false,
    dc2Morning: false,
    dc2Afternoon: false,
    workPermitsToday: 0
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const inspections: Inspection[] = JSON.parse(localStorage.getItem('inspections') || '[]');
    const workPermits: WorkPermit[] = JSON.parse(localStorage.getItem('workPermits') || '[]');

    const todayInspections = inspections.filter(i => i.date === today);
    const todayPermits = workPermits.filter(p => p.entryDate === today);

    setTodayStats({
      dc1Morning: todayInspections.some(i => i.datacenter === 'DC1' && i.shift === 'morning' && i.completed),
      dc1Afternoon: todayInspections.some(i => i.datacenter === 'DC1' && i.shift === 'afternoon' && i.completed),
      dc2Morning: todayInspections.some(i => i.datacenter === 'DC2' && i.shift === 'morning' && i.completed),
      dc2Afternoon: todayInspections.some(i => i.datacenter === 'DC2' && i.shift === 'afternoon' && i.completed),
      workPermitsToday: todayPermits.length
    });
  }, []);

  const getCurrentShift = () => {
    const hour = new Date().getHours();
    return hour < 14 ? 'morning' : 'afternoon';
  };

  const isShiftCompleted = (datacenter: 'DC1' | 'DC2', shift: 'morning' | 'afternoon') => {
    return todayStats[`${datacenter.toLowerCase()}${shift.charAt(0).toUpperCase() + shift.slice(1)}` as keyof typeof todayStats] as boolean;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Inspección Data Center
          </h1>
          <p className="text-xl text-gray-600">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            Turno actual: {getCurrentShift() === 'morning' ? 'Mañana' : 'Tarde'}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DC1 Mañana</p>
                <p className={`text-2xl font-bold ${todayStats.dc1Morning ? 'text-green-600' : 'text-orange-600'}`}>
                  {todayStats.dc1Morning ? 'Completada' : 'Pendiente'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                todayStats.dc1Morning ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <CheckSquare className={`w-6 h-6 ${todayStats.dc1Morning ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DC1 Tarde</p>
                <p className={`text-2xl font-bold ${todayStats.dc1Afternoon ? 'text-green-600' : 'text-orange-600'}`}>
                  {todayStats.dc1Afternoon ? 'Completada' : 'Pendiente'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                todayStats.dc1Afternoon ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <CheckSquare className={`w-6 h-6 ${todayStats.dc1Afternoon ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DC2 Mañana</p>
                <p className={`text-2xl font-bold ${todayStats.dc2Morning ? 'text-green-600' : 'text-orange-600'}`}>
                  {todayStats.dc2Morning ? 'Completada' : 'Pendiente'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                todayStats.dc2Morning ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <CheckSquare className={`w-6 h-6 ${todayStats.dc2Morning ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DC2 Tarde</p>
                <p className={`text-2xl font-bold ${todayStats.dc2Afternoon ? 'text-green-600' : 'text-orange-600'}`}>
                  {todayStats.dc2Afternoon ? 'Completada' : 'Pendiente'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                todayStats.dc2Afternoon ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <CheckSquare className={`w-6 h-6 ${todayStats.dc2Afternoon ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inspection Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckSquare className="w-6 h-6 mr-3 text-blue-600" />
              Nueva Inspección
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => onNewInspection('DC1', 'morning')}
                disabled={isShiftCompleted('DC1', 'morning')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isShiftCompleted('DC1', 'morning')
                    ? 'border-green-200 bg-green-50 text-green-600 cursor-not-allowed'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">DC1 - Mañana</p>
                  <p className="text-sm text-gray-500">
                    {isShiftCompleted('DC1', 'morning') ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNewInspection('DC1', 'afternoon')}
                disabled={isShiftCompleted('DC1', 'afternoon')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isShiftCompleted('DC1', 'afternoon')
                    ? 'border-green-200 bg-green-50 text-green-600 cursor-not-allowed'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">DC1 - Tarde</p>
                  <p className="text-sm text-gray-500">
                    {isShiftCompleted('DC1', 'afternoon') ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNewInspection('DC2', 'morning')}
                disabled={isShiftCompleted('DC2', 'morning')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isShiftCompleted('DC2', 'morning')
                    ? 'border-green-200 bg-green-50 text-green-600 cursor-not-allowed'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">DC2 - Mañana</p>
                  <p className="text-sm text-gray-500">
                    {isShiftCompleted('DC2', 'morning') ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNewInspection('DC2', 'afternoon')}
                disabled={isShiftCompleted('DC2', 'afternoon')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isShiftCompleted('DC2', 'afternoon')
                    ? 'border-green-200 bg-green-50 text-green-600 cursor-not-allowed'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">DC2 - Tarde</p>
                  <p className="text-sm text-gray-500">
                    {isShiftCompleted('DC2', 'afternoon') ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Other Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-green-600" />
              Otras Acciones
            </h2>
            <div className="space-y-4">
              <button
                onClick={onNewWorkPermit}
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Nuevo Permiso de Trabajo
              </button>
              
              <button
                onClick={onViewHistory}
                className="w-full p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <History className="w-5 h-5 mr-2" />
                Ver Historial
              </button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Permisos de trabajo hoy: {todayStats.workPermitsToday}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
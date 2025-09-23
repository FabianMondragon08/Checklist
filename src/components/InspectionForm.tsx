import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Inspection, ChecklistItem } from '../types';
import { checklistTemplate } from '../data/checklistTemplate';

interface InspectionFormProps {
  datacenter: 'DC1' | 'DC2';
  shift: 'morning' | 'afternoon';
  onBack: () => void;
  onSave: (inspection: Inspection) => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  datacenter,
  shift,
  onBack,
  onSave
}) => {
  const [inspector, setInspector] = useState('');
  const [generalObservations, setGeneralObservations] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    checklistTemplate.map((item, index) => ({
      ...item,
      id: `${index}`,
      completed: false,
      observations: ''
    }))
  );

  const handleItemToggle = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleObservationChange = (itemId: string, observation: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, observations: observation }
          : item
      )
    );
  };

  const handleSave = () => {
    if (!inspector.trim()) {
      alert('Por favor ingrese el nombre del inspector');
      return;
    }

    const inspection: Inspection = {
      id: `${Date.now()}`,
      datacenter,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-ES', { hour12: false }),
      shift,
      checklist,
      generalObservations,
      inspector: inspector.trim(),
      completed: true
    };

    onSave(inspection);
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'clima': return 'Operaciones de Clima y Control';
      case 'electrico': return 'Instalaciones Eléctricas';
      case 'seguridad': return 'Seguridad';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clima': return '🌡️';
      case 'electrico': return '⚡';
      case 'seguridad': return '🔒';
      default: return '📋';
    }
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Inspección {datacenter} - {shift === 'morning' ? 'Mañana' : 'Tarde'}
              </h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('es-ES')} - {new Date().toLocaleTimeString('es-ES', { hour12: false })}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <span className="text-sm text-gray-500">{completedItems}/{totalItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Inspector Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Inspector</h2>
          <input
            type="text"
            placeholder="Nombre completo del inspector"
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Checklist */}
        {Object.entries(groupedChecklist).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3 text-2xl">{getCategoryIcon(category)}</span>
                {getCategoryName(category)}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleItemToggle(item.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-gray-900 mb-2 ${item.completed ? 'line-through opacity-75' : ''}`}>
                          {item.description}
                        </p>
                        <textarea
                          placeholder="Observaciones adicionales (opcional)"
                          value={item.observations || ''}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          rows={2}
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* General Observations */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Observaciones Generales
          </h2>
          <textarea
            placeholder="Observaciones generales de la inspección..."
            value={generalObservations}
            onChange={(e) => setGeneralObservations(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <button
            onClick={handleSave}
            disabled={!inspector.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Inspección
          </button>
        </div>
      </div>
    </div>
  );
};
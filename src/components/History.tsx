import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Eye, Filter, Calendar, FileText } from 'lucide-react';
import { Inspection, WorkPermit } from '../types';
import { PDFGenerator } from '../utils/pdfGenerator';

interface HistoryProps {
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [workPermits, setWorkPermits] = useState<WorkPermit[]>([]);
  const [activeTab, setActiveTab] = useState<'inspections' | 'permits'>('inspections');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<Inspection | WorkPermit | null>(null);

  useEffect(() => {
    const storedInspections: Inspection[] = JSON.parse(localStorage.getItem('inspections') || '[]');
    const storedPermits: WorkPermit[] = JSON.parse(localStorage.getItem('workPermits') || '[]');
    
    setInspections(storedInspections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setWorkPermits(storedPermits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const filteredInspections = inspections.filter(inspection => 
    !dateFilter || inspection.date === dateFilter
  );

  const filteredPermits = workPermits.filter(permit => 
    !dateFilter || permit.entryDate === dateFilter
  );

  const exportData = () => {
    const dataToExport = activeTab === 'inspections' ? filteredInspections : filteredPermits;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${activeTab}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const InspectionDetails = ({ inspection }: { inspection: Inspection }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Data Center</p>
          <p className="font-semibold">{inspection.datacenter}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Turno</p>
          <p className="font-semibold">{inspection.shift === 'morning' ? 'Mañana' : 'Tarde'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fecha</p>
          <p className="font-semibold">{new Date(inspection.date).toLocaleDateString('es-ES')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Hora</p>
          <p className="font-semibold">{inspection.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Inspector</p>
          <p className="font-semibold">{inspection.inspector}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Items Completados</p>
          <p className="font-semibold">
            {inspection.checklist.filter(item => item.completed).length}/{inspection.checklist.length}
          </p>
        </div>
      </div>

      {inspection.generalObservations && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Observaciones Generales</p>
          <p className="bg-gray-50 p-3 rounded-lg">{inspection.generalObservations}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Checklist Detallado</h3>
        <div className="space-y-2">
          {inspection.checklist.map((item, index) => (
            <div key={index} className={`p-3 rounded border ${item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center mb-1">
                <span className={`w-2 h-2 rounded-full mr-2 ${item.completed ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="font-medium">{item.description}</span>
              </div>
              {item.observations && (
                <p className="text-sm text-gray-600 ml-4">{item.observations}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WorkPermitDetails = ({ permit }: { permit: WorkPermit }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Nombre</p>
          <p className="font-semibold">{permit.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Identificación</p>
          <p className="font-semibold">{permit.identification}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Empresa</p>
          <p className="font-semibold">{permit.company}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fecha de Ingreso</p>
          <p className="font-semibold">{new Date(permit.entryDate).toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Motivo del Acceso</p>
        <p className="bg-gray-50 p-3 rounded-lg">{permit.accessReason}</p>
      </div>

      {permit.equipmentTools && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Equipos/Herramientas</p>
          <p className="bg-gray-50 p-3 rounded-lg">{permit.equipmentTools}</p>
        </div>
      )}

      {permit.observations && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Observaciones</p>
          <p className="bg-gray-50 p-3 rounded-lg">{permit.observations}</p>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Persona que Autoriza</p>
        <p className="bg-gray-50 p-3 rounded-lg">{permit.authorizedPerson}</p>
      </div>

      {(permit.providerSignature || permit.dcManagerSignature || permit.collaboratorSignature) && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Firmas</p>
          <div className="grid grid-cols-3 gap-4">
            {permit.providerSignature && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Proveedor</p>
                <p className="font-medium">{permit.providerSignature}</p>
              </div>
            )}
            {permit.dcManagerSignature && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">DC Manager</p>
                <p className="font-medium">{permit.dcManagerSignature}</p>
              </div>
            )}
            {permit.collaboratorSignature && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Colaborador</p>
                <p className="font-medium">{permit.collaboratorSignature}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Historial
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {'datacenter' in selectedItem ? 'Detalle de Inspección' : 'Detalle de Permiso'}
              </h1>
              <div className="w-20"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            {'datacenter' in selectedItem ? 
              <InspectionDetails inspection={selectedItem as Inspection} /> :
              <WorkPermitDetails permit={selectedItem as WorkPermit} />
            }
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
            <button
              onClick={exportData}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('inspections')}
                className={`px-6 py-2 font-medium transition-colors ${
                  activeTab === 'inspections'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inspecciones ({filteredInspections.length})
              </button>
              <button
                onClick={() => setActiveTab('permits')}
                className={`px-6 py-2 font-medium transition-colors ${
                  activeTab === 'permits'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Permisos ({filteredPermits.length})
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {activeTab === 'inspections' ? (
            <div className="p-6">
              {filteredInspections.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inspecciones</h3>
                  <p className="text-gray-500">No se encontraron inspecciones para los filtros seleccionados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInspections.map((inspection) => (
                    <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {inspection.datacenter}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {inspection.shift === 'morning' ? 'Mañana' : 'Tarde'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(inspection.date).toLocaleDateString('es-ES')} - {inspection.time}
                      </p>
                      <p className="text-sm text-gray-600">Inspector: {inspection.inspector}</p>
                      <p className="text-sm text-gray-600">
                        Completado: {inspection.checklist.filter(item => item.completed).length}/{inspection.checklist.length}
                      </p>
                      <button
                        onClick={() => setSelectedItem(inspection)}
                        className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors mt-3"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => PDFGenerator.generateInspectionPDF(inspection)}
                        className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors mt-3 ml-2"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Exportar PDF
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {filteredPermits.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay permisos</h3>
                  <p className="text-gray-500">No se encontraron permisos para los filtros seleccionados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPermits.map((permit) => (
                    <div key={permit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {permit.id}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{permit.name}</p>
                          <p className="text-sm text-gray-600">{permit.company}</p>
                          <p className="text-sm text-gray-600">
                            Ingreso: {new Date(permit.entryDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedItem(permit)}
                          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </button>
                        <button
                          onClick={() => PDFGenerator.generateWorkPermitPDF(permit)}
                          className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors ml-2"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Exportar PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
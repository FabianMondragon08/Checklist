import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Download } from 'lucide-react';
import { WorkPermit } from '../types';
import { WorkPermitService } from '../services/workPermitService';
import { PDFGenerator } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

interface WorkPermitFormProps {
  onBack: () => void;
  onSave: (workPermit: WorkPermit) => void;
}

export const WorkPermitForm: React.FC<WorkPermitFormProps> = ({
  onBack,
  onSave
}) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    identification: '',
    company: '',
    accessReason: '',
    equipmentTools: '',
    entryDate: new Date().toISOString().split('T')[0],
    entryTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    exitDate: '',
    exitTime: '',
    authorizedPerson: '',
    observations: '',
    providerSignature: '',
    dcManagerSignature: '',
    collaboratorSignature: ''
  });

  useEffect(() => {
    if (profile?.full_name) {
      setFormData(prev => ({
        ...prev,
        authorizedPerson: profile.full_name
      }));
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ['name', 'identification', 'company', 'accessReason', 'authorizedPerson'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());

    if (missingFields.length > 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      await WorkPermitService.createWorkPermit(formData);
      alert('Permiso de trabajo guardado exitosamente');
      onBack();
    } catch (error) {
      console.error('Error saving work permit:', error);
      alert('Error al guardar el permiso de trabajo');
    }
  };

  const handleExportPDF = () => {
    // Validate required fields
    const requiredFields = ['name', 'identification', 'company', 'accessReason', 'authorizedPerson'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());

    if (missingFields.length > 0) {
      alert('Por favor complete todos los campos requeridos antes de exportar');
      return;
    }

    const workPermit: WorkPermit = {
      id: `WP-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    };

    PDFGenerator.generateWorkPermitPDF(workPermit);
  };

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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                ANEXO 1
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mt-2">
                PERMISO DE TRABAJO O ACTIVIDAD EN DATA CENTER
              </h2>
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificación: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.identification}
                  onChange={(e) => handleInputChange('identification', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Número de identificación"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del acceso: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.accessReason}
                onChange={(e) => handleInputChange('accessReason', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción del motivo del acceso"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipos o herramientas que ingresan:
              </label>
              <textarea
                value={formData.equipmentTools}
                onChange={(e) => handleInputChange('equipmentTools', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lista de equipos o herramientas"
              />
            </div>

            {/* Entry and Exit Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Fecha y Hora de Ingreso</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de ingreso:</label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => handleInputChange('entryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de ingreso:</label>
                  <input
                    type="time"
                    value={formData.entryTime}
                    onChange={(e) => handleInputChange('entryTime', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Fecha y Hora de Salida</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de salida:</label>
                  <input
                    type="date"
                    value={formData.exitDate}
                    onChange={(e) => handleInputChange('exitDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de salida:</label>
                  <input
                    type="time"
                    value={formData.exitTime}
                    onChange={(e) => handleInputChange('exitTime', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Persona que autoriza el acceso (nombre y cargo): <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.authorizedPerson}
                onChange={(e) => handleInputChange('authorizedPerson', e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre y cargo de quien autoriza"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones:
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma Proveedor:
                </label>
                <input
                  type="text"
                  value={formData.providerSignature}
                  onChange={(e) => handleInputChange('providerSignature', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma DC Manager:
                </label>
                <input
                  type="text"
                  value={formData.dcManagerSignature}
                  onChange={(e) => handleInputChange('dcManagerSignature', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del DC Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma Colaborador:
                </label>
                <input
                  type="text"
                  value={formData.collaboratorSignature}
                  onChange={(e) => handleInputChange('collaboratorSignature', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del colaborador"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar Permiso
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { ChecklistItem } from '../types';

export const checklistTemplate: Omit<ChecklistItem, 'id' | 'completed' | 'observations'>[] = [
  // Operaciones de Clima y Control
  {
    category: 'clima',
    description: 'Estado operativo de cada unidad de aire acondicionado (encendido / standby)'
  },
  {
    category: 'clima',
    description: 'Revisión de temperatura ambiente en DC'
  },
  {
    category: 'clima',
    description: 'Comprobar que no existan alarmas en los paneles de los aires'
  },
  {
    category: 'clima',
    description: 'Confirmar que no hay acumulación de polvo o suciedad'
  },
  {
    category: 'clima',
    description: 'Confirmar que la dirección del flujo de aire es adecuada'
  },
  {
    category: 'clima',
    description: 'Estado de UPS (alarmas, indicadores, autonomía)'
  },
  
  // Instalaciones Eléctricas
  {
    category: 'electrico',
    description: 'Comprobación de tableros eléctricos y breakers'
  },
  {
    category: 'electrico',
    description: 'Revisión de cables en tomas eléctricas y PDU'
  },
  {
    category: 'electrico',
    description: 'Revisión visual de paneles y switches bien organizados y peinados'
  },
  {
    category: 'electrico',
    description: 'Confirmar que no existan cables desconectados o mal ajustados'
  },
  {
    category: 'electrico',
    description: 'Verificar que no haya exceso de tensión eléctrica en cables'
  },
  {
    category: 'electrico',
    description: 'Estado de luces LED en servidores, switches (sin alarmas rojas/ámbar)'
  },
  
  // Seguridad
  {
    category: 'seguridad',
    description: 'Revisión de acceso/cerradura, espacio adecuado, tapas'
  },
  {
    category: 'seguridad',
    description: 'Revisión de cerraduras y accesos a HVAC y puertas del datacenter'
  },
  {
    category: 'seguridad',
    description: 'Confirmar registros de ingreso en bitácora o sistema biométrico'
  },
  {
    category: 'seguridad',
    description: 'Verificar funcionamiento de cámaras de seguridad'
  },
  {
    category: 'seguridad',
    description: 'Revisar sensores de humo/incendio y extintores'
  }
];
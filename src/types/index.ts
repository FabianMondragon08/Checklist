export interface ChecklistItem {
  id: string;
  category: 'clima' | 'electrico' | 'seguridad';
  description: string;
  completed: boolean;
  observations?: string;
}

export interface Inspection {
  id: string;
  datacenter: 'DC1' | 'DC2';
  date: string;
  time: string;
  shift: 'morning' | 'afternoon';
  checklist: ChecklistItem[];
  generalObservations: string;
  inspector: string;
  completed: boolean;
}

export interface WorkPermit {
  id: string;
  name: string;
  identification: string;
  company: string;
  accessReason: string;
  equipmentTools: string;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  authorizedPerson: string;
  observations: string;
  providerSignature: string;
  dcManagerSignature: string;
  collaboratorSignature: string;
  createdAt: string;
}
import { supabase } from '../lib/supabase';
import { WorkPermit } from '../types';

export class WorkPermitService {
  // Crear nuevo permiso de trabajo
  static async createWorkPermit(workPermit: Omit<WorkPermit, 'id' | 'createdAt'>) {
    try {
      const { data, error } = await supabase
        .from('work_permits')
        .insert({
          name: workPermit.name,
          identification: workPermit.identification,
          company: workPermit.company,
          access_reason: workPermit.accessReason,
          equipment_tools: workPermit.equipmentTools,
          entry_date: workPermit.entryDate,
          entry_time: workPermit.entryTime,
          exit_date: workPermit.exitDate || null,
          exit_time: workPermit.exitTime || null,
          authorized_person: workPermit.authorizedPerson,
          observations: workPermit.observations,
          provider_signature: workPermit.providerSignature,
          dc_manager_signature: workPermit.dcManagerSignature,
          collaborator_signature: workPermit.collaboratorSignature
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating work permit:', error);
      throw error;
    }
  }

  // Obtener permisos de trabajo con filtros
  static async getWorkPermits(filters?: {
    date?: string;
    company?: string;
  }) {
    try {
      let query = supabase
        .from('work_permits')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.date) {
        query = query.eq('entry_date', filters.date);
      }
      if (filters?.company) {
        query = query.ilike('company', `%${filters.company}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar datos al formato esperado por la aplicación
      return data.map(permit => ({
        id: permit.id,
        name: permit.name,
        identification: permit.identification,
        company: permit.company,
        accessReason: permit.access_reason,
        equipmentTools: permit.equipment_tools,
        entryDate: permit.entry_date,
        entryTime: permit.entry_time,
        exitDate: permit.exit_date,
        exitTime: permit.exit_time,
        authorizedPerson: permit.authorized_person,
        observations: permit.observations,
        providerSignature: permit.provider_signature,
        dcManagerSignature: permit.dc_manager_signature,
        collaboratorSignature: permit.collaborator_signature,
        createdAt: permit.created_at
      })) as WorkPermit[];
    } catch (error) {
      console.error('Error fetching work permits:', error);
      throw error;
    }
  }

  // Obtener conteo de permisos por fecha
  static async getWorkPermitsCountByDate(date: string) {
    try {
      const { count, error } = await supabase
        .from('work_permits')
        .select('*', { count: 'exact', head: true })
        .eq('entry_date', date);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching work permits count:', error);
      throw error;
    }
  }

  // Actualizar permiso de trabajo
  static async updateWorkPermit(id: string, updates: Partial<WorkPermit>) {
    try {
      const { data, error } = await supabase
        .from('work_permits')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.identification && { identification: updates.identification }),
          ...(updates.company && { company: updates.company }),
          ...(updates.accessReason && { access_reason: updates.accessReason }),
          ...(updates.equipmentTools && { equipment_tools: updates.equipmentTools }),
          ...(updates.entryDate && { entry_date: updates.entryDate }),
          ...(updates.entryTime && { entry_time: updates.entryTime }),
          ...(updates.exitDate && { exit_date: updates.exitDate }),
          ...(updates.exitTime && { exit_time: updates.exitTime }),
          ...(updates.authorizedPerson && { authorized_person: updates.authorizedPerson }),
          ...(updates.observations && { observations: updates.observations }),
          ...(updates.providerSignature && { provider_signature: updates.providerSignature }),
          ...(updates.dcManagerSignature && { dc_manager_signature: updates.dcManagerSignature }),
          ...(updates.collaboratorSignature && { collaborator_signature: updates.collaboratorSignature })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating work permit:', error);
      throw error;
    }
  }
}
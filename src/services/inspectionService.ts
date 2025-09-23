import { supabase } from '../lib/supabase';
import { Inspection, ChecklistItem } from '../types';

export class InspectionService {
  // Crear nueva inspección
  static async createInspection(inspection: Omit<Inspection, 'id'>) {
    try {
      // Insertar inspección
      const { data: inspectionData, error: inspectionError } = await supabase
        .from('inspections')
        .insert({
          datacenter: inspection.datacenter,
          date: inspection.date,
          time: inspection.time,
          shift: inspection.shift,
          inspector: inspection.inspector,
          general_observations: inspection.generalObservations,
          completed: inspection.completed
        })
        .select()
        .single();

      if (inspectionError) throw inspectionError;

      // Insertar elementos del checklist
      const checklistItems = inspection.checklist.map(item => ({
        inspection_id: inspectionData.id,
        category: item.category,
        description: item.description,
        completed: item.completed,
        observations: item.observations || ''
      }));

      const { error: checklistError } = await supabase
        .from('checklist_items')
        .insert(checklistItems);

      if (checklistError) throw checklistError;

      return inspectionData;
    } catch (error) {
      console.error('Error creating inspection:', error);
      throw error;
    }
  }

  // Obtener inspecciones con filtros
  static async getInspections(filters?: {
    datacenter?: 'DC1' | 'DC2';
    date?: string;
    shift?: 'morning' | 'afternoon';
  }) {
    try {
      let query = supabase
        .from('inspections')
        .select(`
          *,
          checklist_items (*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.datacenter) {
        query = query.eq('datacenter', filters.datacenter);
      }
      if (filters?.date) {
        query = query.eq('date', filters.date);
      }
      if (filters?.shift) {
        query = query.eq('shift', filters.shift);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar datos al formato esperado por la aplicación
      return data.map(inspection => ({
        id: inspection.id,
        datacenter: inspection.datacenter,
        date: inspection.date,
        time: inspection.time,
        shift: inspection.shift,
        inspector: inspection.inspector,
        generalObservations: inspection.general_observations,
        completed: inspection.completed,
        checklist: inspection.checklist_items.map((item: any) => ({
          id: item.id,
          category: item.category,
          description: item.description,
          completed: item.completed,
          observations: item.observations
        }))
      })) as Inspection[];
    } catch (error) {
      console.error('Error fetching inspections:', error);
      throw error;
    }
  }

  // Obtener plantillas del checklist
  static async getChecklistTemplates() {
    try {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (error) throw error;

      return data.map(template => ({
        category: template.category,
        description: template.description
      }));
    } catch (error) {
      console.error('Error fetching checklist templates:', error);
      throw error;
    }
  }

  // Verificar si ya existe una inspección para el día y turno
  static async checkExistingInspection(
    datacenter: 'DC1' | 'DC2',
    date: string,
    shift: 'morning' | 'afternoon'
  ) {
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('id')
        .eq('datacenter', datacenter)
        .eq('date', date)
        .eq('shift', shift)
        .eq('completed', true)
        .limit(1);

      if (error) throw error;

      return data.length > 0;
    } catch (error) {
      console.error('Error checking existing inspection:', error);
      throw error;
    }
  }

  // Obtener estadísticas del día
  static async getTodayStats(date: string) {
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('datacenter, shift, completed')
        .eq('date', date)
        .eq('completed', true);

      if (error) throw error;

      const stats = {
        dc1Morning: false,
        dc1Afternoon: false,
        dc2Morning: false,
        dc2Afternoon: false
      };

      data.forEach(inspection => {
        const key = `${inspection.datacenter.toLowerCase()}${
          inspection.shift.charAt(0).toUpperCase() + inspection.shift.slice(1)
        }` as keyof typeof stats;
        stats[key] = true;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching today stats:', error);
      throw error;
    }
  }
}
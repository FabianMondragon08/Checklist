/*
  # Crear tabla de plantillas de checklist

  1. Nueva Tabla
    - `checklist_templates`
      - `id` (uuid, primary key)
      - `category` (text)
      - `description` (text)
      - `order_index` (integer)
      - `active` (boolean)
      - `created_at` (timestamp)

  2. Datos iniciales
    - Insertar elementos del checklist predefinidos

  3. Seguridad
    - Habilitar RLS
    - Políticas para usuarios autenticados
*/

-- Crear tabla de plantillas de checklist
CREATE TABLE IF NOT EXISTS checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('clima', 'electrico', 'seguridad')),
  description text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para checklist_templates
CREATE POLICY "Users can view all checklist templates"
  ON checklist_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert checklist templates"
  ON checklist_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update checklist templates"
  ON checklist_templates
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insertar datos iniciales del checklist
INSERT INTO checklist_templates (category, description, order_index) VALUES
-- Operaciones de Clima y Control
('clima', 'Estado operativo de cada unidad de aire acondicionado (encendido / standby)', 1),
('clima', 'Revisión de temperatura ambiente en DC', 2),
('clima', 'Comprobar que no existan alarmas en los paneles de los aires', 3),
('clima', 'Confirmar que no hay acumulación de polvo o suciedad', 4),
('clima', 'Confirmar que la dirección del flujo de aire es adecuada', 5),
('clima', 'Estado de UPS (alarmas, indicadores, autonomía)', 6),

-- Instalaciones Eléctricas
('electrico', 'Comprobación de tableros eléctricos y breakers', 7),
('electrico', 'Revisión de cables en tomas eléctricas y PDU', 8),
('electrico', 'Revisión visual de paneles y switches bien organizados y peinados', 9),
('electrico', 'Confirmar que no existan cables desconectados o mal ajustados', 10),
('electrico', 'Verificar que no haya exceso de tensión eléctrica en cables', 11),
('electrico', 'Estado de luces LED en servidores, switches (sin alarmas rojas/ámbar)', 12),

-- Seguridad
('seguridad', 'Revisión de acceso/cerradura, espacio adecuado, tapas', 13),
('seguridad', 'Revisión de cerraduras y accesos a HVAC y puertas del datacenter', 14),
('seguridad', 'Confirmar registros de ingreso en bitácora o sistema biométrico', 15),
('seguridad', 'Verificar funcionamiento de cámaras de seguridad', 16),
('seguridad', 'Revisar sensores de humo/incendio y extintores', 17);

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_checklist_templates_category ON checklist_templates(category);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_order ON checklist_templates(order_index);
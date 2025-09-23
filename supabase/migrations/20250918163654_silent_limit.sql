/*
  # Crear tablas para sistema de inspección de Data Center

  1. Nuevas Tablas
    - `inspections`
      - `id` (uuid, primary key)
      - `datacenter` (text, DC1 o DC2)
      - `date` (date)
      - `time` (time)
      - `shift` (text, morning o afternoon)
      - `inspector` (text)
      - `general_observations` (text)
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `checklist_items`
      - `id` (uuid, primary key)
      - `inspection_id` (uuid, foreign key)
      - `category` (text, clima/electrico/seguridad)
      - `description` (text)
      - `completed` (boolean)
      - `observations` (text)
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios autenticados
*/

-- Crear tabla de inspecciones
CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  datacenter text NOT NULL CHECK (datacenter IN ('DC1', 'DC2')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  time time NOT NULL DEFAULT CURRENT_TIME,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon')),
  inspector text NOT NULL,
  general_observations text DEFAULT '',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de elementos del checklist
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('clima', 'electrico', 'seguridad')),
  description text NOT NULL,
  completed boolean DEFAULT false,
  observations text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Políticas para inspections
CREATE POLICY "Users can view all inspections"
  ON inspections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inspections"
  ON inspections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inspections"
  ON inspections
  FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para checklist_items
CREATE POLICY "Users can view all checklist items"
  ON checklist_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert checklist items"
  ON checklist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update checklist items"
  ON checklist_items
  FOR UPDATE
  TO authenticated
  USING (true);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(date);
CREATE INDEX IF NOT EXISTS idx_inspections_datacenter ON inspections(datacenter);
CREATE INDEX IF NOT EXISTS idx_inspections_shift ON inspections(shift);
CREATE INDEX IF NOT EXISTS idx_checklist_items_inspection_id ON checklist_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_category ON checklist_items(category);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en inspections
CREATE TRIGGER update_inspections_updated_at
  BEFORE UPDATE ON inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
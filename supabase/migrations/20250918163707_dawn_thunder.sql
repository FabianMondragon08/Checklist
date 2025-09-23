/*
  # Crear tabla para permisos de trabajo

  1. Nueva Tabla
    - `work_permits`
      - `id` (uuid, primary key)
      - `permit_number` (text, único)
      - `name` (text)
      - `identification` (text)
      - `company` (text)
      - `access_reason` (text)
      - `equipment_tools` (text)
      - `entry_date` (date)
      - `entry_time` (time)
      - `exit_date` (date)
      - `exit_time` (time)
      - `authorized_person` (text)
      - `observations` (text)
      - `provider_signature` (text)
      - `dc_manager_signature` (text)
      - `collaborator_signature` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS
    - Políticas para usuarios autenticados
*/

-- Crear tabla de permisos de trabajo
CREATE TABLE IF NOT EXISTS work_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_number text UNIQUE NOT NULL DEFAULT 'WP-' || extract(epoch from now())::text,
  name text NOT NULL,
  identification text NOT NULL,
  company text NOT NULL,
  access_reason text NOT NULL,
  equipment_tools text DEFAULT '',
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  entry_time time NOT NULL DEFAULT CURRENT_TIME,
  exit_date date,
  exit_time time,
  authorized_person text NOT NULL,
  observations text DEFAULT '',
  provider_signature text DEFAULT '',
  dc_manager_signature text DEFAULT '',
  collaborator_signature text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE work_permits ENABLE ROW LEVEL SECURITY;

-- Políticas para work_permits
CREATE POLICY "Users can view all work permits"
  ON work_permits
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert work permits"
  ON work_permits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update work permits"
  ON work_permits
  FOR UPDATE
  TO authenticated
  USING (true);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_work_permits_entry_date ON work_permits(entry_date);
CREATE INDEX IF NOT EXISTS idx_work_permits_company ON work_permits(company);
CREATE INDEX IF NOT EXISTS idx_work_permits_permit_number ON work_permits(permit_number);

-- Trigger para actualizar updated_at en work_permits
CREATE TRIGGER update_work_permits_updated_at
  BEFORE UPDATE ON work_permits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
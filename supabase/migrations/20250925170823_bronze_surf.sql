/*
  # Esquema inicial de la base de datos

  1. Tablas principales
    - `user_profiles` - Perfiles de usuario con roles
    - `inspections` - Inspecciones de data center
    - `checklist_items` - Items del checklist de inspección
    - `work_permits` - Permisos de trabajo
    - `checklist_templates` - Plantillas del checklist
    - `audit_logs` - Logs de auditoría

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas de acceso basadas en roles
    - Triggers para auditoría y timestamps

  3. Funciones
    - Función para manejar nuevos usuarios
    - Función para auditoría automática
    - Función para actualizar timestamps
*/

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    role text DEFAULT 'inspector' CHECK (role IN ('inspector', 'supervisor', 'admin', 'superadmin')),
    department text DEFAULT 'datacenter',
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view all profiles"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Trigger para updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla de plantillas de checklist
CREATE TABLE IF NOT EXISTS checklist_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL CHECK (category IN ('clima', 'electrico', 'seguridad')),
    description text NOT NULL,
    order_index integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para checklist_templates
CREATE POLICY "Users can view all checklist templates"
    ON checklist_templates FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert checklist templates"
    ON checklist_templates FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update checklist templates"
    ON checklist_templates FOR UPDATE
    TO authenticated
    USING (true);

-- Índices para checklist_templates
CREATE INDEX IF NOT EXISTS idx_checklist_templates_category ON checklist_templates(category);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_order ON checklist_templates(order_index);

-- Tabla de inspecciones
CREATE TABLE IF NOT EXISTS inspections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    datacenter text NOT NULL CHECK (datacenter IN ('DC1', 'DC2')),
    date date DEFAULT CURRENT_DATE,
    time time DEFAULT CURRENT_TIME,
    shift text NOT NULL CHECK (shift IN ('morning', 'afternoon')),
    inspector text NOT NULL,
    general_observations text DEFAULT '',
    completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Políticas para inspections
CREATE POLICY "Users can view all inspections"
    ON inspections FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert inspections"
    ON inspections FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update inspections"
    ON inspections FOR UPDATE
    TO authenticated
    USING (true);

-- Índices para inspections
CREATE INDEX IF NOT EXISTS idx_inspections_datacenter ON inspections(datacenter);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(date);
CREATE INDEX IF NOT EXISTS idx_inspections_shift ON inspections(shift);

-- Trigger para updated_at
CREATE TRIGGER update_inspections_updated_at
    BEFORE UPDATE ON inspections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla de items del checklist
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
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Políticas para checklist_items
CREATE POLICY "Users can view all checklist items"
    ON checklist_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert checklist items"
    ON checklist_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update checklist items"
    ON checklist_items FOR UPDATE
    TO authenticated
    USING (true);

-- Índices para checklist_items
CREATE INDEX IF NOT EXISTS idx_checklist_items_inspection_id ON checklist_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_category ON checklist_items(category);

-- Tabla de permisos de trabajo
CREATE TABLE IF NOT EXISTS work_permits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_number text UNIQUE DEFAULT ('WP-' || extract(epoch from now())),
    name text NOT NULL,
    identification text NOT NULL,
    company text NOT NULL,
    access_reason text NOT NULL,
    equipment_tools text DEFAULT '',
    entry_date date DEFAULT CURRENT_DATE,
    entry_time time DEFAULT CURRENT_TIME,
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
    ON work_permits FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert work permits"
    ON work_permits FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update work permits"
    ON work_permits FOR UPDATE
    TO authenticated
    USING (true);

-- Índices para work_permits
CREATE INDEX IF NOT EXISTS idx_work_permits_permit_number ON work_permits(permit_number);
CREATE INDEX IF NOT EXISTS idx_work_permits_entry_date ON work_permits(entry_date);
CREATE INDEX IF NOT EXISTS idx_work_permits_company ON work_permits(company);

-- Trigger para updated_at
CREATE TRIGGER update_work_permits_updated_at
    BEFORE UPDATE ON work_permits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values jsonb,
    new_values jsonb,
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para audit_logs
CREATE POLICY "Users can view audit logs"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (true);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Función para auditoría automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría
CREATE TRIGGER audit_inspections
    AFTER INSERT OR UPDATE OR DELETE ON inspections
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_work_permits
    AFTER INSERT OR UPDATE OR DELETE ON work_permits
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'inspector'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
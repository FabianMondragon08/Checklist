/*
  # Crear usuario superadmin inicial

  1. Insertar usuario superadmin
    - Email: admin@datacenter.com
    - Password: SuperAdmin123!
    - Role: superadmin

  2. Nota: Este script debe ejecutarse manualmente después de crear el usuario en Supabase Auth
*/

-- Insertar perfil de superadmin (el ID debe coincidir con el usuario creado en Auth)
-- Reemplazar 'USER_ID_FROM_AUTH' con el ID real del usuario creado
INSERT INTO user_profiles (id, full_name, role, department, active) 
VALUES (
  'USER_ID_FROM_AUTH', -- Reemplazar con el ID real del usuario
  'Super Administrador',
  'superadmin',
  'datacenter',
  true
) ON CONFLICT (id) DO UPDATE SET
  role = 'superadmin',
  full_name = 'Super Administrador',
  active = true;

-- Nota: Para crear el usuario superadmin:
-- 1. Ve a Supabase Dashboard > Authentication > Users
-- 2. Crea un nuevo usuario con email: admin@datacenter.com y password: SuperAdmin123!
-- 3. Copia el ID del usuario creado
-- 4. Reemplaza 'USER_ID_FROM_AUTH' en este script con el ID real
-- 5. Ejecuta este script en el SQL Editor
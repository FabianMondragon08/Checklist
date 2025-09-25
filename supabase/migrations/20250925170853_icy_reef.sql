/*
  # Insertar plantillas del checklist

  1. Plantillas por categoría
    - Clima y Control
    - Instalaciones Eléctricas  
    - Seguridad

  2. Orden específico para cada categoría
*/

-- Insertar plantillas de checklist para Clima y Control
INSERT INTO checklist_templates (category, description, order_index) VALUES
('clima', 'Estado operativo de cada unidad de aire acondicionado (encendido / standby)', 1),
('clima', 'Revisión de temperatura ambiente en DC', 2),
('clima', 'Comprobar que no existan alarmas en los paneles de los aires', 3),
('clima', 'Confirmar que no hay acumulación de polvo o suciedad', 4),
('clima', 'Confirmar que la dirección del flujo de aire es adecuada', 5),
('clima', 'Estado de UPS (alarmas, indicadores, autonomía)', 6);

-- Insertar plantillas de checklist para Instalaciones Eléctricas
INSERT INTO checklist_templates (category, description, order_index) VALUES
('electrico', 'Comprobación de tableros eléctricos y breakers', 1),
('electrico', 'Revisión de cables en tomas eléctricas y PDU', 2),
('electrico', 'Revisión visual de paneles y switches bien organizados y peinados', 3),
('electrico', 'Confirmar que no existan cables desconectados o mal ajustados', 4),
('electrico', 'Verificar que no haya exceso de tensión eléctrica en cables', 5),
('electrico', 'Estado de luces LED en servidores, switches (sin alarmas rojas/ámbar)', 6);

-- Insertar plantillas de checklist para Seguridad
INSERT INTO checklist_templates (category, description, order_index) VALUES
('seguridad', 'Revisión de acceso/cerradura, espacio adecuado, tapas', 1),
('seguridad', 'Revisión de cerraduras y accesos a HVAC y puertas del datacenter', 2),
('seguridad', 'Confirmar registros de ingreso en bitácora o sistema biométrico', 3),
('seguridad', 'Verificar funcionamiento de cámaras de seguridad', 4),
('seguridad', 'Revisar sensores de humo/incendio y extintores', 5);
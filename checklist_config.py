
# -*- coding: utf-8 -*-
"""
Definición del checklist para inspecciones de Data Center.
Cada item tiene:
- id: identificador corto (clave en la BD)
- label: texto mostrado en el formulario
- tipo: "opcion", "numero" o "texto"
  - "opcion" renderiza opciones: "OK", "No OK", "N/A"
  - "numero" renderiza un input numérico
  - "texto" renderiza un input de texto corto
"""
CHECKLIST = [
    {
        "categoria": "Condiciones Ambientales",
        "items": [
            {"id": "ac_operativo", "label": "Estado operativo de cada unidad de aire acondicionado (encendido / standby)", "tipo": "opcion"},
            {"id": "temp_ambiente_c", "label": "Revisión de temperatura ambiente (°C)", "tipo": "numero"},
            {"id": "alarmas_aires", "label": "Comprobar que no existan alarmas en los paneles de los aires", "tipo": "opcion"},
            {"id": "sin_polvo_suciedad", "label": "Confirmar que no hay acumulación de polvo o suciedad", "tipo": "opcion"},
            {"id": "flujo_aire_adecuado", "label": "Confirmar que la dirección del flujo de aire es adecuada", "tipo": "opcion"},
        ]
    },
    {
        "categoria": "Infraestructura Eléctrica (Tableros y respaldo)",
        "items": [
            {"id": "estado_ups", "label": "Estado de UPS (alarmas, indicadores, autonomía)", "tipo": "opcion"},
            {"id": "tableros_breakers", "label": "Comprobación de tableros eléctricos y breakers", "tipo": "opcion"},
            {"id": "cables_pdu_tomas", "label": "Revisión de cables en tomas eléctricas y PDU", "tipo": "opcion"},
        ]
    },
    {
        "categoria": "Infraestructura Lógica (Cableado y equipos)",
        "items": [
            {"id": "patch_switch_organizado", "label": "Revisión visual de patch panels y switches (cables organizados y peinados)", "tipo": "opcion"},
            {"id": "sin_cables_sueltos", "label": "Confirmar que no existan cables desconectados o mal ajustados", "tipo": "opcion"},
            {"id": "sin_tension_doblados", "label": "Verificar que no haya exceso de tensión o doblados en los cables", "tipo": "opcion"},
            {"id": "leds_ok", "label": "Estado de luces LED en servidores/switches (sin alarmas rojas/ámbar)", "tipo": "opcion"},
        ]
    },
    {
        "categoria": "Seguridad Física",
        "items": [
            {"id": "racks_orden_tapas", "label": "Revisión de racks: orden, espacio adecuado, tapas", "tipo": "opcion"},
            {"id": "cerraduras_accesos", "label": "Revisión de cerraduras y accesos a racks y puertas del datacenter", "tipo": "opcion"},
            {"id": "registro_ingreso", "label": "Confirmar registros de ingreso en bitácora o sistema biométrico", "tipo": "opcion"},
            {"id": "camaras_funcionando", "label": "Verificar funcionamiento de cámaras de seguridad", "tipo": "opcion"},
            {"id": "sensores_incendio_extintores", "label": "Revisar sensores de humo/incendio y extintores", "tipo": "opcion"},
        ]
    }
]

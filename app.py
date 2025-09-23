
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time
import json, os

from checklist_config import CHECKLIST

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///dc_checklist.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "change-me")

db = SQLAlchemy(app)

# ------------------ MODELOS ------------------
class Inspection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    datacenter = db.Column(db.String(10), nullable=False)    # "DC1" o "DC2"
    fecha = db.Column(db.Date, nullable=False)
    turno = db.Column(db.String(10), nullable=False)         # "Mañana" / "Tarde"
    respuestas_json = db.Column(db.Text, nullable=False)      # JSON con resultados del checklist
    observaciones = db.Column(db.Text)                        # Observaciones adicionales
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("datacenter", "fecha", "turno", name="uniq_dc_fecha_turno"),
    )

    @property
    def respuestas(self):
        try:
            return json.loads(self.respuestas_json or "{}")
        except Exception:
            return {}

class Permit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    identificacion = db.Column(db.String(100))
    empresa = db.Column(db.String(200))
    motivo = db.Column(db.Text)
    equipos = db.Column(db.Text)
    fecha_ingreso = db.Column(db.Date)
    hora_ingreso = db.Column(db.Time)
    fecha_salida = db.Column(db.Date)
    hora_salida = db.Column(db.Time)
    autoriza = db.Column(db.String(200))     # nombre y cargo
    observaciones = db.Column(db.Text)
    firma_proveedor = db.Column(db.String(200))
    firma_dc_manager = db.Column(db.String(200))
    firma_colaborador = db.Column(db.String(200))
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)


# ------------------ HELPERS ------------------
TURNOS = [("Mañana", "Mañana"), ("Tarde", "Tarde")]
DCS = [("DC1", "DC1"), ("DC2", "DC2")]

def turno_sugerido_por_hora(hora: int) -> str:
    return "Mañana" if 0 <= hora < 12 else "Tarde"

def status_hoy():
    """Devuelve si ya existen registros por cada DC/turno del día actual."""
    hoy = date.today()
    estados = {}
    for dc in ["DC1", "DC2"]:
        estados[dc] = {}
        for t in ["Mañana", "Tarde"]:
            existe = Inspection.query.filter_by(datacenter=dc, fecha=hoy, turno=t).first() is not None
            estados[dc][t] = existe
    return estados

# ------------------ RUTAS ------------------
@app.route("/")
def index():
    estados = status_hoy()
    return render_template("index.html", estados=estados, hoy=date.today(), turno_sugerido=turno_sugerido_por_hora(datetime.now().hour))

@app.route("/inspecciones")
def inspecciones_lista():
    dc = request.args.get("dc")
    q = Inspection.query.order_by(Inspection.creado_en.desc())
    if dc in {"DC1", "DC2"}:
        q = q.filter_by(datacenter=dc)
    inspecciones = q.limit(200).all()
    return render_template("inspection_list.html", inspecciones=inspecciones, dc=dc)

@app.route("/inspecciones/<int:inspeccion_id>")
def inspeccion_detalle(inspeccion_id):
    ins = Inspection.query.get_or_404(inspeccion_id)
    return render_template("inspection_detail.html", ins=ins, checklist=CHECKLIST)

@app.route("/inspecciones/nueva", methods=["GET", "POST"])
def inspeccion_nueva():
    if request.method == "POST":
        datacenter = request.form.get("datacenter")
        fecha = request.form.get("fecha")
        turno = request.form.get("turno")
        observaciones = request.form.get("observaciones", "").strip()

        # Construir respuestas a partir del checklist
        respuestas = {}
        for bloque in CHECKLIST:
            for it in bloque["items"]:
                valor = request.form.get(it["id"])
                if it["tipo"] == "numero":
                    try:
                        valor = float(valor) if valor not in (None, "",) else None
                    except Exception:
                        valor = None
                respuestas[it["id"]] = valor

        try:
            obj = Inspection(
                datacenter=datacenter,
                fecha=datetime.strptime(fecha, "%Y-%m-%d").date(),
                turno=turno,
                respuestas_json=json.dumps(respuestas, ensure_ascii=False),
                observaciones=observaciones,
            )
            db.session.add(obj)
            db.session.commit()
            flash("Inspección guardada correctamente.", "success")
            return redirect(url_for("inspeccion_detalle", inspeccion_id=obj.id))
        except Exception as e:
            db.session.rollback()
            flash("No se pudo guardar. Revise que no exista ya una inspección para el mismo DC/fecha/turno.", "danger")

    # GET
    hoy_str = date.today().strftime("%Y-%m-%d")
    turno_def = turno_sugerido_por_hora(datetime.now().hour)
    dc_def = request.args.get("dc", "DC1")
    return render_template("inspection_form.html", checklist=CHECKLIST, hoy=hoy_str, turno_def=turno_def, dc_def=dc_def, TURNOS=TURNOS, DCS=DCS)

# --------- PERMISOS (ANEXO 1) ---------
@app.route("/permisos")
def permisos_lista():
    permisos = Permit.query.order_by(Permit.creado_en.desc()).limit(200).all()
    return render_template("permit_list.html", permisos=permisos)

@app.route("/permisos/<int:permiso_id>")
def permiso_detalle(permiso_id):
    p = Permit.query.get_or_404(permiso_id)
    return render_template("permit_detail.html", p=p)

@app.route("/permisos/nuevo", methods=["GET", "POST"])
def permiso_nuevo():
    if request.method == "POST":
        def parse_date(s):
            try:
                return datetime.strptime(s, "%Y-%m-%d").date() if s else None
            except Exception:
                return None
        def parse_time(s):
            try:
                return datetime.strptime(s, "%H:%M").time() if s else None
            except Exception:
                return None

        p = Permit(
            nombre=request.form.get("nombre", "").strip(),
            identificacion=request.form.get("identificacion", "").strip(),
            empresa=request.form.get("empresa", "").strip(),
            motivo=request.form.get("motivo", "").strip(),
            equipos=request.form.get("equipos", "").strip(),
            fecha_ingreso=parse_date(request.form.get("fecha_ingreso")),
            hora_ingreso=parse_time(request.form.get("hora_ingreso")),
            fecha_salida=parse_date(request.form.get("fecha_salida")),
            hora_salida=parse_time(request.form.get("hora_salida")),
            autoriza=request.form.get("autoriza", "").strip(),
            observaciones=request.form.get("observaciones", "").strip(),
            firma_proveedor=request.form.get("firma_proveedor", "").strip(),
            firma_dc_manager=request.form.get("firma_dc_manager", "").strip(),
            firma_colaborador=request.form.get("firma_colaborador", "").strip(),
        )
        try:
            db.session.add(p)
            db.session.commit()
            flash("Permiso creado.", "success")
            return redirect(url_for("permiso_detalle", permiso_id=p.id))
        except Exception:
            db.session.rollback()
            flash("No se pudo crear el permiso.", "danger")

    hoy = date.today().strftime("%Y-%m-%d")
    ahora_hhmm = datetime.now().strftime("%H:%M")
    return render_template("permit_form.html", hoy=hoy, ahora=ahora_hhmm)

# --------- INICIALIZACIÓN ---------
@app.before_first_request
def init_db():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

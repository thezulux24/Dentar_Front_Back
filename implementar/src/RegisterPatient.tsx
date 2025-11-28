import React, { useState } from 'react'

export type PatientForm = {
  nombres: string
  apellidos: string
  fechaNacimiento: string
  cedula: string
  telefono: string
  correo: string
  sexo: string
  estadoCivil: string
  direccion: string
  edad: string
  condicionesMedicas: string
  alergias: string
  medicamentos: string
  enfermedadesCronicas: string
  motivoConsulta: string
  procedimiento: string
  notas: string
  observaciones: string
  evolucion: string
  formulacion: string
  fechaUltimoTratamiento: string
}

const emptyForm: PatientForm = {
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  cedula: '',
  telefono: '',
  correo: '',
  sexo: '',
  estadoCivil: '',
  direccion: '',
  edad: '',
  condicionesMedicas: '',
  alergias: '',
  medicamentos: '',
  enfermedadesCronicas: '',
  motivoConsulta: '',
  procedimiento: '',
  notas: '',
  observaciones: '',
  evolucion: '',
  formulacion: '',
  fechaUltimoTratamiento: ''
}

type Props = {
  onSave: (p: PatientForm) => void
  onCancel: () => void
}

const RegisterPatient: React.FC<Props> = ({ onSave, onCancel }) => {
  const [form, setForm] = useState<PatientForm>(emptyForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setForm(emptyForm)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    onCancel()
  }

  return (
    <div className="form-page">
      <h2 className="form-page-title">Información personal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label">Nombres</label>
            <input
              className="form-input"
              type="text"
              name="nombres"
              placeholder="Ej: Juan"
              value={form.nombres}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Apellidos</label>
            <input
              className="form-input"
              type="text"
              name="apellidos"
              placeholder="Ej: Perez"
              value={form.apellidos}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              className="form-input"
              type="text"
              name="fechaNacimiento"
              placeholder="DD/MM/AAAA"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Número de cédula</label>
            <input
              className="form-input"
              type="text"
              name="cedula"
              placeholder="Ej: 23456745"
              value={form.cedula}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Teléfono</label>
            <input
              className="form-input"
              type="text"
              name="telefono"
              placeholder="+57"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              name="correo"
              placeholder="Ej: usuario@gmail.com"
              value={form.correo}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Sexo</label>
            <input
              className="form-input"
              type="text"
              name="sexo"
              placeholder="men or women"
              value={form.sexo}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Estado civil</label>
            <input
              className="form-input"
              type="text"
              name="estadoCivil"
              placeholder="Estado civil"
              value={form.estadoCivil}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Dirección</label>
            <input
              className="form-input"
              type="text"
              name="direccion"
              placeholder="Ej: calle 00 #00-00"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Edad</label>
            <input
              className="form-input"
              type="number"
              name="edad"
              placeholder="Edad"
              value={form.edad}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 className="form-section-title">Historial médico</h3>
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label">Condiciones médicas previas</label>
            <input
              className="form-input"
              type="text"
              name="condicionesMedicas"
              placeholder="Ej: Diabetes, hipertensión"
              value={form.condicionesMedicas}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Alergias</label>
            <input
              className="form-input"
              type="text"
              name="alergias"
              placeholder="Ej: Penicilina, látex"
              value={form.alergias}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Medicamentos actuales</label>
            <input
              className="form-input"
              type="text"
              name="medicamentos"
              placeholder="Ej: Ibuprofeno, Metformina"
              value={form.medicamentos}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Enfermedades crónicas</label>
            <input
              className="form-input"
              type="text"
              name="enfermedadesCronicas"
              placeholder="Ej: diabetes, hipertensión"
              value={form.enfermedadesCronicas}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 className="form-section-title">Información del tratamiento</h3>
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label">Motivo de consulta</label>
            <input
              className="form-input"
              type="text"
              name="motivoConsulta"
              placeholder="Ej: Dolor en molar derecho"
              value={form.motivoConsulta}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Procedimiento principal</label>
            <input
              className="form-input"
              type="text"
              name="procedimiento"
              placeholder="Ej: Seleccione el tratamiento"
              value={form.procedimiento}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Notas relevantes</label>
            <input
              className="form-input"
              type="text"
              name="notas"
              placeholder="Ej: Paciente nervioso"
              value={form.notas}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Observaciones</label>
            <input
              className="form-input"
              type="text"
              name="observaciones"
              placeholder="Observación paciente"
              value={form.observaciones}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Evolución</label>
            <input
              className="form-input"
              type="text"
              name="evolucion"
              placeholder="Evolución del paciente"
              value={form.evolucion}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Formulación</label>
            <input
              className="form-input"
              type="text"
              name="formulacion"
              placeholder="Formulación tratamiento"
              value={form.formulacion}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Fecha último tratamiento</label>
            <input
              className="form-input"
              type="text"
              name="fechaUltimoTratamiento"
              placeholder="DD/MM/AA"
              value={form.fechaUltimoTratamiento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterPatient

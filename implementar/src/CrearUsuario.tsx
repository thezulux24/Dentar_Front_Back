import React, { useState } from 'react'

type Props = { setActiveMenu: (key: string) => void }

type Form = {
  nombre: string
  apellido: string
  correo: string
  password: string
  confirmar: string
}

const CrearUsuario: React.FC<Props> = ({ setActiveMenu }) => {
  const [form, setForm] = useState<Form>({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmar: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Nuevo usuario JSON:', form)
    setActiveMenu('administracion')
  }

  return (
    <div className="crearusuario-page">
      <form className="crearusuario-form" onSubmit={handleSubmit}>
        <div className="crearusuario-field">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="crearusuario-field">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>
        <div className="crearusuario-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
          />
        </div>
        <div className="crearusuario-field">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="crearusuario-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={handleChange}
          />
        </div>

        <div className="crearusuario-actions">
          <button type="submit" className="btn-primary">
            Registrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CrearUsuario

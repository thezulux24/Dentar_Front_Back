import React, { useState } from 'react'

type Odontologo = { id: number; nombre: string; rol: string; conexion: string; estado: 'Activo' | 'Inactivo' }
type Paciente = { id: number; cedula: string; nombre: string; visita: string; estado: 'Activo' | 'Inactivo' }
type Auxiliar = { id: number; cedula: string; nombre: string; conexion: string; estado: 'Activo' | 'Inactivo' }

type Props = { setActiveMenu: (key: string) => void }

const Administracion: React.FC<Props> = ({ setActiveMenu }) => {
  const [odontologos, setOdontologos] = useState<Odontologo[]>([
    { id: 1, nombre: 'Dr. Pablorro', rol: 'Odontólogo', conexion: '23/04/2024', estado: 'Activo' },
    { id: 2, nombre: 'Dr. Camila', rol: 'Odontólogo', conexion: '22/04/2024', estado: 'Activo' },
    { id: 3, nombre: 'Dr. José', rol: 'Odontólogo', conexion: '23/04/2024', estado: 'Activo' },
    { id: 4, nombre: 'Aux. Leidy', rol: 'Auxiliar', conexion: '20/04/2024', estado: 'Activo' },
  ])

  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: 1, cedula: '12845699as', nombre: 'María Vargas', visita: '24/04/2024', estado: 'Activo' },
    { id: 2, cedula: '2345619887', nombre: 'Arnold Reed', visita: '23/04/2024', estado: 'Activo' },
    { id: 3, cedula: '345679912', nombre: 'Susana Díaz', visita: '23/04/2024', estado: 'Activo' },
  ])

  const [auxiliares, setAuxiliares] = useState<Auxiliar[]>([
    { id: 1, cedula: '1023456789', nombre: 'Leidy Torres', conexion: '22/04/2024', estado: 'Activo' },
    { id: 2, cedula: '1122334455', nombre: 'Carlos Díaz', conexion: '20/04/2024', estado: 'Inactivo' },
    { id: 3, cedula: '2233445566', nombre: 'Laura Ramírez', conexion: '21/04/2024', estado: 'Activo' },
  ])

  const [searchPaciente, setSearchPaciente] = useState('')
  const [searchAuxiliar, setSearchAuxiliar] = useState('')

  const eliminar = (id: number, tipo: 'odontologo' | 'paciente' | 'auxiliar') => {
    if (tipo === 'odontologo') setOdontologos(prev => prev.filter(o => o.id !== id))
    if (tipo === 'paciente') setPacientes(prev => prev.filter(p => p.id !== id))
    if (tipo === 'auxiliar') setAuxiliares(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="administracion-page">
      <h2 className="section-title">Odontólogos</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Última conexión</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {odontologos.map(o => (
            <tr key={o.id}>
              <td>{o.nombre}</td>
              <td>{o.rol}</td>
              <td>{o.conexion}</td>
              <td>
                <span className={`estado-pill ${o.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}`}>{o.estado}</span>
              </td>
              <td>
                <button className="btn-delete" onClick={() => eliminar(o.id, 'odontologo')}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-title">Pacientes</h2>
      <input
        className="admin-search"
        type="text"
        placeholder="Buscar paciente"
        value={searchPaciente}
        onChange={(e) => setSearchPaciente(e.target.value)}
      />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Última visita</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pacientes
            .filter(p =>
              p.nombre.toLowerCase().includes(searchPaciente.toLowerCase()) ||
              p.cedula.includes(searchPaciente)
            )
            .map(p => (
              <tr key={p.id}>
                <td>{p.cedula}</td>
                <td>{p.nombre}</td>
                <td>{p.visita}</td>
                <td>
                  <span className="estado-pill estado-activo">Activo</span>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => eliminar(p.id, 'paciente')}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2 className="section-title">Auxiliares</h2>
      <input
        className="admin-search"
        type="text"
        placeholder="Buscar auxiliar"
        value={searchAuxiliar}
        onChange={(e) => setSearchAuxiliar(e.target.value)}
      />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Última conexión</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {auxiliares
            .filter(a =>
              a.nombre.toLowerCase().includes(searchAuxiliar.toLowerCase()) ||
              a.cedula.includes(searchAuxiliar)
            )
            .map(a => (
              <tr key={a.id}>
                <td>{a.cedula}</td>
                <td>{a.nombre}</td>
                <td>{a.conexion}</td>
                <td>
                  <span className={`estado-pill ${a.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}`}>{a.estado}</span>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => eliminar(a.id, 'auxiliar')}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="crear-usuarios-box">
        <button className="btn-primary" onClick={() => setActiveMenu('crearusuario')}>
          Crear usuarios
        </button>
      </div>
    </div>
  )
}

export default Administracion

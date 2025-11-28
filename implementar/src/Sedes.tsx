import React from 'react'
import sedesJson from './data/sedes.json'

type Sede = {
  id: number
  nombre: string
  direccion: string
  telefono: string
  horario: string
}

const sedes = sedesJson as Sede[]

const Sedes: React.FC = () => {
  return (
    <div className="sedes-page">
      <div className="sedes-card">
        <h2 className="sedes-title">SEDES ODONTOSANI</h2>

        <div className="sedes-content">
          {/* Columna izquierda: mapa estilizado */}
          <div className="sedes-map">
            <div className="sedes-map-bg" />
            <div className="sedes-pin sedes-pin-1">📍</div>
            <div className="sedes-pin sedes-pin-2">📍</div>
            <div className="sedes-pin sedes-pin-3">📍</div>
          </div>

          {/* Columna derecha: tarjetas de sedes */}
          <div className="sedes-list">
            {sedes.map((sede) => (
              <div key={sede.id} className="sede-item">
                <div className="sede-icon">🏢</div>
                <div className="sede-info">
                  <p className="sede-name">{sede.nombre}</p>
                  <p>{sede.direccion}</p>
                  <p>Teléfono: {sede.telefono}</p>
                  <p>Horario: {sede.horario}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sedes

import React, { useState } from 'react'

const banks = [
  'Seleccione el banco',
  'Bancolombia',
  'Davivienda',
  'Banco de Bogotá',
  'BBVA',
  'Nequi',
  'Daviplata',
  'Otro'
]

const Pago: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bank, setBank] = useState(banks[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, email, bank }
    console.log('Simulación de pago JSON:', payload)
    alert('Pago simulado en consola (JSON). Aquí luego se conectaría PSE.')
  }

  return (
    <div className="pago-page">
      <div className="pago-card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Nombre</label>
            <input
              className="form-input"
              type="text"
              placeholder="Nombre del usuario"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              placeholder="usuario@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pago-logo-wrapper">
            <div className="pago-logo-circle">
              <span>pse</span>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Banco</label>
            <select
              className="form-input"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              {banks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="pago-actions">
            <button type="submit" className="btn-primary pago-btn">
              Realizar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Pago

import React, { useState } from 'react'
import billingJson from './data/billing.json'

type BillingItem = {
  id: number
  descripcion: string
  cantidadDientes: number
  valorUnitario: number
  descuento: number
}

type BillingData = {
  patient: {
    nombre: string
    edad: number
    ultimaConsulta: string
    etiqueta: string
  }
  items: BillingItem[]
  total: number
  abono: number
  saldoPendiente: number
  saldoFacturado: number
  saldo: number
}

type Props = {
  setActiveMenu: (key: string) => void
}

const data = billingJson as BillingData

const formatCOP = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })

const Facturacion: React.FC<Props> = ({ setActiveMenu }) => {
  const [search, setSearch] = useState('')

  const filteredItems = data.items.filter(item =>
    item.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="billing-page">
      {/* Buscador */}
      <div className="billing-search-row">
        <input
          className="billing-search-input"
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="billing-search-icon">🔍</span>
      </div>

      {/* Tarjeta paciente */}
      <div className="billing-patient-card">
        <div className="billing-patient-avatar">
          <span>JG</span>
        </div>
        <div className="billing-patient-info">
          <p><strong>Nombre:</strong> {data.patient.nombre}</p>
          <p><strong>Edad:</strong> {data.patient.edad} años</p>
        </div>
        <div className="billing-patient-extra">
          <p><strong>Última consulta:</strong> {data.patient.ultimaConsulta}</p>
          <p><strong>Etiqueta:</strong> {data.patient.etiqueta}</p>
        </div>
      </div>

      {/* Botón añadir ítem (por ahora solo visual) */}
      <div className="billing-add-row">
        <button className="btn-primary">Añadir ítem</button>
      </div>

      {/* Tabla de tratamientos */}
      <div className="billing-table-wrapper">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Acciones clínicas</th>
              <th>Ct. Dientes</th>
              <th>Realizado</th>
              <th>Valor unitario</th>
              <th>Descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const totalLinea = item.valorUnitario // o valorUnitario - descuento si quieres
              return (
                <tr key={item.id}>
                  <td className="billing-desc">
                    {item.descripcion}
                  </td>
                  <td>{item.cantidadDientes}</td>
                  <td className="billing-icon-cell">📅</td>
                  <td>{formatCOP(item.valorUnitario)}</td>
                  <td>{formatCOP(item.descuento)}</td>
                  <td>{formatCOP(totalLinea)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="billing-totals">
        <div className="billing-total-row">
          <span>Total:</span>
          <span>{formatCOP(data.total)}</span>
        </div>
        <div className="billing-total-row">
          <span>Abono</span>
          <span>{formatCOP(data.abono)}</span>
        </div>
        <div className="billing-total-row billing-total-warning">
          <span>Saldo pendiente</span>
          <span>{formatCOP(data.saldoPendiente)}</span>
        </div>
        <div className="billing-total-row">
          <span>Saldo facturado</span>
          <span>{formatCOP(data.saldoFacturado)}</span>
        </div>
        <div className="billing-total-row billing-total-warning">
          <span>Saldo pendiente</span>
          <span>{formatCOP(data.saldo)}</span>
        </div>
      </div>

      {/* Botón imprimir factura */}
      <div className="billing-print-row">
        <button
          className="btn-primary billing-print-btn"
          onClick={() => setActiveMenu('facturaImprimir')}
        >
          Imprimir Factura
        </button>
      </div>
    </div>
  )
}

export default Facturacion

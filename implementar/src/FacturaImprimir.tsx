import React from 'react'
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
  saldo: number
  facturaNumero: string
  fecha: string
  nit: string
  telefono: string
  correo: string
  web: string
}

const data = billingJson as BillingData

const formatCOP = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })

const FacturaImprimir: React.FC = () => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="invoice-page">
      {/* Cabecera paciente */}
      <div className="invoice-header">
        <div className="invoice-patient-left">
          <div className="invoice-avatar">
            <span>JG</span>
          </div>
          <div>
            <p><strong>Nombre:</strong> {data.patient.nombre}</p>
            <p><strong>Edad:</strong> {data.patient.edad} años</p>
          </div>
        </div>
        <div className="invoice-patient-right">
          <p><strong>Última consulta:</strong> {data.patient.ultimaConsulta}</p>
          <p><strong>Etiqueta:</strong> {data.patient.etiqueta}</p>
        </div>
      </div>

      {/* Título FACTURA */}
      <div className="invoice-title-strip">
        <h2>FACTURA</h2>
      </div>

      {/* Info factura */}
      <div className="invoice-info-row">
        <div>
          <p>FACTURA N.º: {data.facturaNumero}</p>
          <p>FECHA: {data.fecha}</p>
        </div>
        <div className="invoice-info-right">
          <p>PARA:</p>
          <p className="invoice-patient-name">{data.patient.nombre}</p>
        </div>
      </div>

      {/* Tabla detalle */}
      <div className="invoice-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>DESCRIPCIÓN</th>
              <th>PRECIO</th>
              <th>PRECIO</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(item => {
              const totalLinea = item.valorUnitario
              return (
                <tr key={item.id}>
                  <td className="invoice-desc">
                    {item.descripcion}
                  </td>
                  <td>{formatCOP(item.valorUnitario)}</td>
                  <td>{formatCOP(item.descuento)}</td>
                  <td>{formatCOP(totalLinea)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Saldo grande */}
      <div className="invoice-saldo">
        <span>Saldo</span>
        <span className="invoice-saldo-valor">
          {formatCOP(data.saldo)}
        </span>
      </div>

      {/* Footer empresa */}
      <div className="invoice-footer">
        <p>NIT: {data.nit}</p>
        <p>Teléfono: {data.telefono}</p>
        <p>Correo: {data.correo}</p>
        <p>Página web: {data.web}</p>
      </div>

      {/* Botón imprimir */}
      <div className="invoice-print-row">
        <button className="btn-primary invoice-print-btn" onClick={handlePrint}>
          Imprimir
        </button>
      </div>
    </div>
  )
}

export default FacturaImprimir

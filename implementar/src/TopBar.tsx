import React from 'react'

type Props = {
  activeMenu: string
}

const TopBar: React.FC<Props> = ({ activeMenu }) => {
  let title = 'INICIO'
  if (activeMenu === 'registrar') title = 'REGISTRAR PACIENTE'
  else if (activeMenu === 'agendar') title = 'AGENDAR CITA'
  else if (activeMenu === 'administracion') title = 'ADMINISTRACIÓN'
  else if (activeMenu === 'crearusuario') title = 'CREAR USUARIO'
  else if (activeMenu === 'soporte') title = 'SOPORTE'
  else if (activeMenu && activeMenu !== 'inicio') title = activeMenu.toUpperCase()
  else if (activeMenu === 'configuracion') title = 'CONFIGURACIÓN'
  else if (activeMenu === 'facturacion') title = 'FACTURACIÓN'
  else if (activeMenu === 'facturaImprimir') title = 'FACTURA'
  else if (activeMenu === 'sedes') title = 'SEDES'
  else if (activeMenu === 'pago') title = 'PAGO'



  return (
    <header className="topbar">
      <h1>{title}</h1>
    </header>
  )
}

export default TopBar

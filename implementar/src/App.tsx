import React, { useState } from 'react'
import Sidebar, { Role } from './Sidebar'
import TopBar from './TopBar'
import Dashboard from './Dashboard'
import RegisterPatient, { PatientForm } from './RegisterPatient'
import ScheduleAppointment from './ScheduleAppointment'
import Administracion from './Administracion'
import CrearUsuario from './CrearUsuario'
import Support from './Support'
import Configuracion from './Configuracion'
import Facturacion from './Facturacion'
import FacturaImprimir from './FacturaImprimir'
import Sedes from './Sedes'
import Pago from './Pago'




const App: React.FC = () => {
  const [role, setRole] = useState<Role>('Administrador')
  const [activeMenu, setActiveMenu] = useState<string>('inicio')
  const [patients, setPatients] = useState<(PatientForm & { id: number })[]>([])

  const handleSavePatient = (patient: PatientForm) => {
    const withId = { id: Date.now(), ...patient }
    setPatients(prev => [...prev, withId])
    console.log('Paciente guardado (JSON):', withId)
  }

  const renderContent = () => {
    if (activeMenu === 'inicio') return <Dashboard role={role} setActiveMenu={setActiveMenu} />
    if (activeMenu === 'registrar') {
      return (
        <RegisterPatient
          onSave={handleSavePatient}
          onCancel={() => setActiveMenu('inicio')}
        />
      )
    }
    if (activeMenu === 'agendar') return <ScheduleAppointment />
    if (activeMenu === 'administracion') return <Administracion setActiveMenu={setActiveMenu} />
    if (activeMenu === 'crearusuario') return <CrearUsuario setActiveMenu={setActiveMenu} />
    if (activeMenu === 'soporte') return <Support />
    if (activeMenu === 'configuracion') return <Configuracion />
    if (activeMenu === 'facturacion')
      return <Facturacion setActiveMenu={setActiveMenu} />
    if (activeMenu === 'facturaImprimir')
      return <FacturaImprimir />
    if (activeMenu === 'sedes') return <Sedes />
    if (activeMenu === 'pago') return <Pago />



    return (
      <div className="content-placeholder">
        <h2>{activeMenu.toUpperCase()}</h2>
        <p>Contenido de {activeMenu} visible para el rol {role}.</p>
        <p>
          Aquí podrás más adelante conectar formularios, tablas o lo que
          necesites. Por ahora solo es una vista de ejemplo.
        </p>
        {activeMenu === 'historial' && patients.length > 0 && (
          <div className="patients-debug">
            <h3>Pacientes registrados (JSON en memoria)</h3>
            <pre>{JSON.stringify(patients, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app-root">
      <Sidebar
        role={role}
        setRole={setRole}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <div className="main-area">
        <TopBar activeMenu={activeMenu} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App

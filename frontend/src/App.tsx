import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts & Components
import { MainLayout, PublicLayout, PageAnimation, AlertSystem, AuthLoader, PrivateRoute } from "./components/imports";

//Pages
import { NotFound, Login, Home, Calendar, CalendarPatient, Register, Support, Dashboard, Resources, Diagnostics, NewPatient, PatientPage, Settings, DashboardPatient, IframePage, IframePage2, IframePage3, Billing, Payment} from "./pages/imports";


function App() {

  const location = useLocation();

  return (
    <AnimatePresence>


      <Routes location={location}>

        {/* Rutas públicas - sin autenticación */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PageAnimation><Home /></PageAnimation>} />
          <Route path="/soporte" element={<PageAnimation><Support /></PageAnimation>} />
          <Route path="/recursos" element={<PageAnimation><Resources /></PageAnimation>} />
        </Route>

        <Route path="/autenticacion" element={<PageAnimation><Login /></PageAnimation>} />
        <Route path="/registro" element={<PageAnimation><Register /></PageAnimation>} />

        <Route path="/filters">
          <Route path="whitening" element={<PageAnimation><IframePage /></PageAnimation>} />
          <Route path="ortodoncy" element={<PageAnimation><IframePage2 /></PageAnimation>} />
          <Route path="protesis" element={<PageAnimation><IframePage3 /></PageAnimation>} />
        </Route>
        

        {/* Rutas del paciente */}
        <Route path="/paciente" element={<AuthLoader><PrivateRoute> <MainLayout /> </PrivateRoute></AuthLoader>}>
          <Route path="inicio" element={<PageAnimation key="inicio"><DashboardPatient/></PageAnimation>} />
          <Route path="calendario" element={<PageAnimation key="calendariopaciente"> <CalendarPatient /> </PageAnimation>} />
          <Route path="pagos" element={<PageAnimation key="pagos"><Payment /></PageAnimation>} />
          <Route path="recursos" element={<PageAnimation key="recursospaciente"><Resources /></PageAnimation>} />
          <Route path="soporte" element={<PageAnimation key="supportpatient"><Support /></PageAnimation>} />
          <Route path="configuracion" element={<PageAnimation key="configpaciente"><Settings /></PageAnimation>} />

        </Route>

        {/* Rutas del doctor*/}
        <Route path="/doctor" element={<AuthLoader><PrivateRoute> <MainLayout /> </PrivateRoute></AuthLoader>}>
          <Route path="inicio" element={<PageAnimation key="iniciodoctor"><Dashboard/></PageAnimation>} />
          <Route path="calendario" element={<PageAnimation key="calendario"> <Calendar /> </PageAnimation>} />
          <Route path="soporte" element={<PageAnimation key="supportdoctor"><Support /></PageAnimation>} />
          <Route path="recursos" element={<PageAnimation key="recursosdoctor"><Resources /></PageAnimation>} />
          <Route path="diagnosticos" element={<PageAnimation key="diagnosticosdoctor"><Diagnostics /></PageAnimation>} />
          <Route path="diagnosticos/nuevo" element={<PageAnimation key="newdiagdoctor"><NewPatient /></PageAnimation>} />
          <Route path="diagnosticos/:patientId" element={<PageAnimation key="aptientdoctor"><PatientPage /></PageAnimation>} />
          <Route path="configuracion" element={<PageAnimation key="configdoctor"><Settings /></PageAnimation>} />
        </Route>

        {/* Rutas del auxiliar*/}
        <Route path="/auxiliar" element={<AuthLoader><PrivateRoute> <MainLayout /> </PrivateRoute></AuthLoader>}>
          <Route path="inicio" element={<PageAnimation key="inicioauxiliar"><Dashboard/></PageAnimation>} />
          <Route path="calendario" element={<PageAnimation key="calendarioauxiliar"> <Calendar /> </PageAnimation>} />
          <Route path="soporte" element={<PageAnimation key="supportauxiliar"><Support /></PageAnimation>} />
          <Route path="recursos" element={<PageAnimation key="recursosauxiliar"><Resources /></PageAnimation>} />
          <Route path="diagnosticos" element={<PageAnimation key="diagnosticosauxiliar"><Diagnostics /></PageAnimation>} />
          <Route path="diagnosticos/nuevo" element={<PageAnimation key="newdiagauxiliar"><NewPatient /></PageAnimation>} />
          <Route path="diagnosticos/:patientId" element={<PageAnimation key="aptientauxiliar"><PatientPage /></PageAnimation>} />
          <Route path="facturacion" element={<PageAnimation key="facturacionauxiliar"><Billing /></PageAnimation>} />
          <Route path="configuracion" element={<PageAnimation key="configauxiliar"><Settings /></PageAnimation>} />
        </Route>

        {/* Ruta por defecto para 404 */}
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<PageAnimation key="notfound"><NotFound /></PageAnimation>} />
      </Routes>

      {/* Sistema de alertas */}
      <AlertSystem />

    </AnimatePresence>
  )
}

export default App
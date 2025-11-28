import React, { useState } from 'react'

const specialties = [
  'Cirugía',
  'Estética dental',
  'Odontología general',
  'Odontopediatría',
  'Endodoncia',
  'Periodoncia',
  'Implantología'
]

const dentists = ['Marta Zambrano', 'Briggitte Mosquera', 'Yesenia Mora']

const ScheduleAppointment: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1))
  const [selectedDay, setSelectedDay] = useState<number>(8)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(specialties[0])
  const [selectedDentist, setSelectedDentist] = useState<string>(dentists[0])

  const monthName = currentDate.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric'
  })

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="schedule-page">
      <h2 className="schedule-title">ASIGNACIÓN DE CITAS</h2>

      <div className="schedule-main">
        <div className="schedule-card calendar-card">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>{'<'}</button>
            <span>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </span>
            <button onClick={handleNextMonth}>{'>'}</button>
          </div>

          <div className="calendar-weekdays">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar-days">
            {daysArray.map(day => (
              <button
                key={day}
                className={
                  'calendar-day-btn' +
                  (day === selectedDay ? ' calendar-day-selected' : '')
                }
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="calendar-legend">
            <button className="badge-today">Hoy</button>
            <button className="badge-available">Disponible</button>
            <button className="badge-unavailable">No disponible</button>
          </div>
        </div>

        <div className="schedule-card specialties-card">
          <div className="specialty-pill">
            <span className="specialty-check">✔</span>
            <span>Ortodoncia</span>
          </div>
          <ul className="specialty-list">
            {specialties.map(s => (
              <li
                key={s}
                className={
                  'specialty-item' +
                  (selectedSpecialty === s ? ' specialty-item-active' : '')
                }
                onClick={() => setSelectedSpecialty(s)}
              >
                <span className="specialty-bullet" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="schedule-bottom">
        <div className="schedule-card patient-card">
          <div className="patient-avatar">
            <span>JP</span>
          </div>
          <div className="patient-info">
            <p><strong>Nombre:</strong> Juan Perez</p>
            <p><strong>Edad:</strong> 32 años</p>
            <p><strong>Última consulta:</strong> 5 días</p>
            <p><strong>Etiqueta:</strong> Alergias conocidas</p>
          </div>
        </div>

        <div className="schedule-card dentists-card">
          <ul className="dentists-list">
            {dentists.map(d => (
              <li
                key={d}
                className={
                  'dentist-item' +
                  (selectedDentist === d ? ' dentist-item-active' : '')
                }
                onClick={() => setSelectedDentist(d)}
              >
                <div className="dentist-avatar-small">
                  <span>{d[0]}</span>
                </div>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ScheduleAppointment

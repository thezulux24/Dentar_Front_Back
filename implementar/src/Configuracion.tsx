import React, { useState } from 'react'

type Language = 'es' | 'en'
type Mode = 'claro' | 'oscuro'

const Configuracion: React.FC = () => {
  const [language, setLanguage] = useState<Language>('es')
  const [mode, setMode] = useState<Mode>('claro')

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'es' ? 'en' : 'es'))
  }

  const toggleMode = () => {
    setMode(prev => (prev === 'claro' ? 'oscuro' : 'claro'))
  }

  return (
    <div className="config-page">
      <div className="config-buttons">
        <button className="config-btn" onClick={toggleLanguage}>
          Cambiar Idioma
        </button>
        <p className="config-helper">
          Idioma actual: {language === 'es' ? 'Español' : 'Inglés'}
        </p>

        <button className="config-btn" onClick={toggleMode}>
          Cambiar modo visualización
        </button>
        <p className="config-helper">
          Modo actual: {mode === 'claro' ? 'Claro' : 'Oscuro'}
        </p>
      </div>
    </div>
  )
}

export default Configuracion

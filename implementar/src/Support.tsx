import React, { useState } from 'react'

const Support: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Iniciar chat con:', email)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Mensaje enviado:', message)
    setMessage('')
  }

  return (
    <div className="support-page">
      <div className="support-chat-card">
        <form onSubmit={handleStartChat}>
          <label className="support-label">Correo electrónico</label>
          <input
            className="support-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="support-start-btn">
            Iniciar chat
          </button>
        </form>

        <div className="support-status">
          <span className="status-dot" />
          <span>En línea</span>
        </div>

        <div className="support-messages">
          <div className="bubble bubble-support">
            <p className="bubble-title">Soporte</p>
            <p>Hola, ¿en qué puedo ayudarte?</p>
          </div>
          <div className="bubble bubble-user">
            <p className="bubble-title">Tú</p>
            <p>Necesito ayuda con las citas médicas</p>
          </div>
        </div>

        <form onSubmit={handleSend} className="support-input-row">
          <input
            className="support-input"
            type="text"
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="support-send-btn">➤</button>
        </form>
      </div>

      <div className="support-contact-row">
        <div className="support-contact-card">
          <p className="contact-title">CONTACTO DIRECTO</p>
          <div className="contact-body">
            <span className="contact-icon">✉️</span>
            <span className="contact-text">soporte@soporte.com</span>
          </div>
        </div>
        <div className="support-contact-card">
          <p className="contact-title">CONTACTO DIRECTO</p>
          <div className="contact-body">
            <span className="contact-icon">📱</span>
            <span className="contact-text">310 123 4567</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support

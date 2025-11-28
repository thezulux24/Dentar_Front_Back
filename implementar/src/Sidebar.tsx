import React from 'react'
import menuItemsJson from './data/menuItems.json'
import rolesJson from './data/roles.json'

export type Role = 'Administrador' | 'Odontologo' | 'Auxiliar' | 'Cliente'

type MenuItem = {
  key: string
  label: string
  section: string
}

type Props = {
  role: Role
  setRole: (r: Role) => void
  activeMenu: string
  setActiveMenu: (key: string) => void
}

const menuItems = menuItemsJson as MenuItem[]
const rolesConfig = rolesJson as Record<Role, string[]>

const Sidebar: React.FC<Props> = ({ role, setRole, activeMenu, setActiveMenu }) => {
  const allowedKeys = rolesConfig[role] || []

  const main = menuItems.filter(m => m.section === 'Principal' && allowedKeys.includes(m.key))
  const gestion = menuItems.filter(m => m.section === 'Gestion Pacientes' && allowedKeys.includes(m.key))
  const admin = menuItems.filter(m => m.section === 'Administración' && allowedKeys.includes(m.key))
  const bottom = menuItems.filter(m => m.section === 'Inferior' && allowedKeys.includes(m.key))

  const renderGroup = (title: string | null, items: MenuItem[]) => {
    if (!items.length) return null
    return (
      <div className="sidebar-group">
        {title && <p className="sidebar-group-title">{title}</p>}
        {items.map(item => (
          <button
            key={item.key}
            className={
              'sidebar-item' + (activeMenu === item.key ? ' sidebar-item-active' : '')
            }
            onClick={() => setActiveMenu(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text-main">Dent</span>
        <span className="logo-text-accent">AR</span>
        <span className="logo-tooth">🦷</span>
      </div>

      <div className="sidebar-role">
        <label htmlFor="role-select">Rol:</label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          {Object.keys(rolesConfig).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <nav className="sidebar-menu">
        {renderGroup('Menú', main)}
        {renderGroup('Gestión Pacientes', gestion)}
        {renderGroup('Administración', admin)}
      </nav>

      <div className="sidebar-bottom">
        {renderGroup(null, bottom)}
        <button className="btn-logout">Cerrar Sesión</button>
      </div>
    </aside>
  )
}

export default Sidebar

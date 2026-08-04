import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../../features/auth'
import User from '../User'
import styles from './styles.module.scss'

type HeaderProps = {
  title: string
  icon?: LucideIcon
}

function Header({ title, icon: Icon }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className={styles.root}>
      <h1 className={styles.title}>
        {Icon ? <Icon className={styles.icon} aria-hidden size={28} /> : null}
        <span>{title}</span>
      </h1>
      {user ? <User user={user} onLogout={logout} /> : null}
    </header>
  )
}

export default Header

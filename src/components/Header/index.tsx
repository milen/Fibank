import { useAuth } from '../../features/auth'
import User from '../User'
import styles from './styles.module.scss'

type HeaderProps = {
  title: string
}

function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      {user ? <User user={user} onLogout={logout} /> : null}
    </header>
  )
}

export default Header

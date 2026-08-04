import { CircleUserRound, LogOut } from 'lucide-react'
import type { AuthUser } from '../../features/auth'
import Button from '../Button'
import styles from './styles.module.scss'

type UserProps = {
  user: AuthUser
  onLogout: () => void
}

function User({ user, onLogout }: UserProps) {
  return (
    <div className={styles.root}>
      <p className={styles.name}>
        <CircleUserRound className={styles.icon} aria-hidden size={20} />
        <span>
          {user.firstName} {user.lastName}
        </span>
      </p>
      <Button type="danger" onClick={onLogout} variant="text" icon={LogOut} iconPosition="end" aria-label="Logout">
        Logout
      </Button>
    </div>
  )
}

export default User

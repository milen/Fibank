import type { AuthUser } from '../../features/auth'
import styles from './styles.module.scss'

type UserProps = {
  user: AuthUser
  onLogout: () => void
}

function User({ user, onLogout }: UserProps) {
  return (
    <div className={styles.root}>
      <p className={styles.name}>
        Wellcome {user.firstName} {user.lastName}
      </p>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default User

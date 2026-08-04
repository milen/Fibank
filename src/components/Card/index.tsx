import type { ReactNode } from 'react'
import styles from './styles.module.scss'

export type CardType = 'default' | 'success' | 'disabled' | 'danger' | 'warning'

type CardProps = {
  children: ReactNode
  title?: string
  type?: CardType
  className?: string
}

function Card({ children, title, type = 'default', className }: CardProps) {
  const rootClassName = className ? `${styles.root} ${className}` : styles.root

  return (
    <section className={rootClassName} data-type={type}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <div className={styles.body}>{children}</div>
    </section>
  )
}

export default Card

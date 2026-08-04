import type { ReactNode } from 'react'
import styles from './styles.module.scss'

export type CardType = 'default' | 'success' | 'disabled' | 'danger' | 'warning'

type CardProps = {
  children: ReactNode
  title?: string
  type?: CardType
}

function Card({ children, title, type = 'default' }: CardProps) {
  return (
    <section className={styles.root} data-type={type}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <div className={styles.body}>{children}</div>
    </section>
  )
}

export default Card

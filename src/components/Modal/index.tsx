import type { ReactNode } from 'react'
import Card, { type CardType } from '../Card'
import styles from './styles.module.scss'

type ModalProps = {
  open: boolean
  title: string
  type?: CardType
  children: ReactNode
  className?: string
  onClose?: () => void
}

function Modal({
  open,
  title,
  type = 'default',
  children,
  className,
  onClose,
}: ModalProps) {
  if (!open) {
    return null
  }

  const contentClassName = className
    ? `${styles.content} ${className}`
    : styles.content

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <Card title={title} type={type} className={contentClassName}>
        {children}
      </Card>
    </div>
  )
}

export default Modal

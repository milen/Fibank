import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import styles from './styles.module.scss'

export type ButtonType = 'default' | 'success' | 'disabled' | 'danger' | 'warning'
export type ButtonVariant = 'solid' | 'text'
export type ButtonIconPosition = 'start' | 'end'

type ButtonBaseProps = {
  type?: ButtonType
  variant?: ButtonVariant
  iconPosition?: ButtonIconPosition
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

type IconOnlyButtonProps = ButtonBaseProps & {
  icon: LucideIcon
  children?: undefined
  'aria-label': string
}

type TextButtonProps = ButtonBaseProps & {
  icon?: LucideIcon
  children: ReactNode
  'aria-label'?: string
}

export type ButtonProps = IconOnlyButtonProps | TextButtonProps

function Button({
  icon: Icon,
  children,
  type = 'default',
  variant = 'solid',
  iconPosition = 'start',
  htmlType = 'button',
  disabled = false,
  fullWidth = false,
  className,
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const effectiveType: ButtonType = disabled ? 'disabled' : type
  const isIconOnly = Boolean(Icon) && children == null
  const rootClassName = [
    styles.root,
    isIconOnly ? styles.iconOnly : null,
    fullWidth ? styles.fullWidth : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const iconElement = Icon ? (
    <Icon className={styles.icon} aria-hidden={children != null} size={18} />
  ) : null
  const labelElement = children != null ? <span className={styles.label}>{children}</span> : null

  return (
    <button
      className={rootClassName}
      type={htmlType}
      data-type={effectiveType}
      data-variant={variant}
      disabled={disabled || type === 'disabled'}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {iconPosition === 'end' ? (
        <>
          {labelElement}
          {iconElement}
        </>
      ) : (
        <>
          {iconElement}
          {labelElement}
        </>
      )}
    </button>
  )
}

export default Button

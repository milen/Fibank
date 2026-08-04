import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Input from '.'
import { isValidEmail } from '../../utils/isValidEmail'

describe('Input', () => {
  it('renders a labelled input with the given type', () => {
    render(
      <Input
        id="email"
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
      />,
    )

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('inputMode', 'email')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    function Wrapper() {
      const [value, setValue] = useState('')

      return (
        <Input
          id="username"
          label="Username"
          type="text"
          value={value}
          onChange={(next) => {
            onChange(next)
            setValue(next)
          }}
        />
      )
    }

    render(<Wrapper />)

    await user.type(screen.getByLabelText('Username'), 'abc')
    expect(onChange).toHaveBeenLastCalledWith('abc')
  })

  it('shows an error message and marks the field invalid', () => {
    render(
      <Input
        id="password"
        label="Password"
        type="password"
        value="abc"
        onChange={() => {}}
        error="Too short"
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Too short')
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById('password-error')?.parentElement).toHaveAttribute(
      'data-tone',
      'danger',
    )
  })

  it('reserves space for the error line when there is no error', () => {
    render(
      <Input
        id="username"
        label="Username"
        type="text"
        value=""
        onChange={() => {}}
      />,
    )

    const errorLine = document.getElementById('username-error')
    expect(errorLine).toBeInTheDocument()
    expect(errorLine?.textContent).toBe('\u00A0')
  })

  it('calls onBlur when the input loses focus', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()

    render(
      <Input
        id="username"
        label="Username"
        type="text"
        value="abc"
        onChange={() => {}}
        onBlur={onBlur}
      />,
    )

    await user.click(screen.getByLabelText('Username'))
    await user.tab()

    expect(onBlur).toHaveBeenCalledOnce()
  })

  it('disables the input when disabled is true', () => {
    render(
      <Input
        id="age"
        label="Age"
        type="number"
        value="25"
        onChange={() => {}}
        disabled
      />,
    )

    expect(screen.getByLabelText('Age')).toBeDisabled()
  })

  it('passes number constraints for number inputs', () => {
    render(
      <Input
        id="age"
        label="Age"
        type="number"
        value="10"
        onChange={() => {}}
        min={0}
        max={120}
        step={1}
      />,
    )

    const input = screen.getByLabelText('Age')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('inputMode', 'numeric')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '120')
    expect(input).toHaveAttribute('step', '1')
  })
})

describe('isValidEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('returns false for invalid email addresses', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })
})

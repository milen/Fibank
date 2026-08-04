import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '.'

const loginMock = vi.fn()
const showOfflineModalMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('../../features/auth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: loginMock,
    logout: vi.fn(),
  }),
}))

vi.mock('../../providers', () => ({
  useOffline: () => ({
    isOfflineModalOpen: false,
    showOfflineModal: showOfflineModalMock,
    hideOfflineModal: vi.fn(),
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

function renderLoginPage() {
  return render(<LoginPage />)
}

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset()
    showOfflineModalMock.mockReset()
    navigateMock.mockReset()
  })

  it('keeps the login button disabled when both fields are empty', () => {
    renderLoginPage()

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('keeps the login button disabled when username is shorter than 4 characters', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'abc')
    await user.type(screen.getByLabelText('Password'), 'validpass')

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('keeps the login button disabled when password is shorter than 4 characters', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'validuser')
    await user.type(screen.getByLabelText('Password'), 'abc')

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('keeps the login button disabled when username is longer than 30 characters', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'a'.repeat(31))
    await user.type(screen.getByLabelText('Password'), 'validpass')

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('keeps the login button disabled when password is longer than 30 characters', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'validuser')
    await user.type(screen.getByLabelText('Password'), 'a'.repeat(31))

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('keeps the login button disabled when values are only whitespace within length', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), '    ')
    await user.type(screen.getByLabelText('Password'), 'validpass')

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })

  it('enables the login button when both fields are within 4 to 30 characters', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'emilys')
    await user.type(screen.getByLabelText('Password'), 'emilyspass')

    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled()
  })

  it('enables the login button at the minimum and maximum allowed lengths', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Username'), 'abcd')
    await user.type(screen.getByLabelText('Password'), 'a'.repeat(30))

    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled()
  })

  it('shows field errors only after leaving the input', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const username = screen.getByLabelText('Username')
    await user.type(username, 'abc')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Must be between 4 and 30 characters',
    )
  })

  it('clears the field error when typing again after a blur validation', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const username = screen.getByLabelText('Username')
    await user.type(username, 'abc')
    await user.tab()

    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.clear(username)
    await user.type(username, 'a')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

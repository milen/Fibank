import type { AuthSession, LoginResponse } from './types'
import { ApiError } from '../../utils/errors'

const LOGIN_URL = 'https://dummyjson.com/auth/login'

export async function loginRequest(
  username: string,
  password: string,
): Promise<AuthSession> {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  })

  let data: (LoginResponse & { message?: string }) | null

  try {
    data = (await response.json()) as LoginResponse & { message?: string }
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new ApiError(data?.message ?? `Login failed (${response.status})`, response.status)
  }

  if (!data?.accessToken || !data?.refreshToken) {
    throw new ApiError('Unexpected login response')
  }

  const { accessToken, refreshToken, ...user } = data

  return {
    user,
    accessToken,
    refreshToken,
  }
}

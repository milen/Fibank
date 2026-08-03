export type AuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export type LoginResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

export function isNetworkError(error: unknown): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true
  }

  if (error instanceof TypeError) {
    return true
  }

  if (error instanceof Error) {
    return /failed to fetch|networkerror|load failed|network request failed/i.test(
      error.message,
    )
  }

  return false
}

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

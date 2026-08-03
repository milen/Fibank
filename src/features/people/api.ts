import { getCachedPeoplePage, setCachedPeoplePage } from './cache'
import { ApiError } from '../../utils/errors'
import type { PeoplePage } from './types'

const PEOPLE_URL = 'https://swapi.py4e.com/api/people/'

export async function fetchPeoplePage(page: number): Promise<PeoplePage> {
  const cached = getCachedPeoplePage(page)
  if (cached) {
    return cached
  }

  const response = await fetch(`${PEOPLE_URL}?page=${page}`)

  if (!response.ok) {
    throw new ApiError(`Failed to fetch people (${response.status})`, response.status)
  }

  try {
    const data = (await response.json()) as PeoplePage
    setCachedPeoplePage(page, data)
    return data
  } catch {
    throw new ApiError('Failed to parse people response')
  }
}

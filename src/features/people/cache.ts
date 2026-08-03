import type { PeoplePage } from './types'

type CacheEntry = {
  cachedAt: number
  data: PeoplePage
}

const CACHE_PREFIX = 'swapi_people_page_'
const CACHE_TTL_MS = 5 * 60 * 1000

function cacheKey(page: number) {
  return `${CACHE_PREFIX}${page}`
}

export function getCachedPeoplePage(page: number): PeoplePage | null {
  try {
    const raw = localStorage.getItem(cacheKey(page))
    if (!raw) return null

    const entry = JSON.parse(raw) as CacheEntry
    if (!entry?.data || typeof entry.cachedAt !== 'number') {
      localStorage.removeItem(cacheKey(page))
      return null
    }

    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(page))
      return null
    }

    return entry.data
  } catch {
    localStorage.removeItem(cacheKey(page))
    return null
  }
}

export function setCachedPeoplePage(page: number, data: PeoplePage): void {
  const entry: CacheEntry = {
    cachedAt: Date.now(),
    data,
  }

  localStorage.setItem(cacheKey(page), JSON.stringify(entry))
}

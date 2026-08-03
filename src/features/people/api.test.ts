import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchPeoplePage } from './api'
import { ApiError } from '../../utils/errors'
import type { PeoplePage } from './types'

const fetchMock = vi.fn<typeof fetch>()

vi.stubGlobal('fetch', fetchMock)

const samplePage: PeoplePage = {
  count: 87,
  next: 'https://swapi.py4e.com/api/people/?page=2',
  previous: null,
  results: [
    {
      name: 'Luke Skywalker',
      mass: '77',
      height: '172',
      hair_color: 'blond',
      skin_color: 'fair',
    },
  ],
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('fetchPeoplePage', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    localStorage.clear()
  })

  it('fetches a people page from SWAPI and caches the result', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(samplePage))

    const page = await fetchPeoplePage(1)

    expect(fetchMock).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/?page=1')
    expect(page).toEqual(samplePage)
    expect(localStorage.getItem('swapi_people_page_1')).toContain('Luke Skywalker')
  })

  it('returns cached data without calling fetch when the cache is fresh', async () => {
    localStorage.setItem(
      'swapi_people_page_2',
      JSON.stringify({
        cachedAt: Date.now(),
        data: samplePage,
      }),
    )

    const page = await fetchPeoplePage(2)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(page).toEqual(samplePage)
  })

  it('refetches when the cached page is expired', async () => {
    localStorage.setItem(
      'swapi_people_page_1',
      JSON.stringify({
        cachedAt: Date.now() - 6 * 60 * 1000,
        data: samplePage,
      }),
    )

    const refreshedPage: PeoplePage = {
      ...samplePage,
      results: [
        {
          name: 'Leia Organa',
          mass: '49',
          height: '150',
          hair_color: 'brown',
          skin_color: 'light',
        },
      ],
    }

    fetchMock.mockResolvedValueOnce(jsonResponse(refreshedPage))

    const page = await fetchPeoplePage(1)

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(page).toEqual(refreshedPage)
  })

  it('throws an ApiError when the API responds with an error status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, { status: 503 }))

    await expect(fetchPeoplePage(1)).rejects.toEqual(
      expect.objectContaining({
        name: 'ApiError',
        message: 'Failed to fetch people (503)',
        status: 503,
      }),
    )
  })

  it('throws an ApiError when the response body is not valid JSON', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('not-json', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      }),
    )

    const error = await fetchPeoplePage(1).catch((err: unknown) => err)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toEqual(
      expect.objectContaining({
        message: 'Failed to parse people response',
      }),
    )
  })

  it('propagates network failures from fetch', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(fetchPeoplePage(3)).rejects.toThrow('Failed to fetch')
  })
})

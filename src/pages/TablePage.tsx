import { useEffect, useState } from 'react'
import { fetchPeoplePage, type Person } from '../features/people'
import { useAuth } from '../features/auth'
import LoadingOverlay from '../components/LoadingOverlay'
import { useOffline } from '../providers'
import { isNetworkError } from '../utils/errors'

const PAGE_SIZE = 10

function TablePage() {
  const { user, logout } = useAuth()
  const { showOfflineModal } = useOffline()
  const [people, setPeople] = useState<Person[]>([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchPeoplePage(page)
        if (!cancelled) {
          setPeople(data.results)
          setTotalCount(data.count)
          setHasNext(data.next !== null)
          setHasPrevious(data.previous !== null)
        }
      } catch (err) {
        if (!cancelled) {
          if (isNetworkError(err)) {
            showOfflineModal()
            setError('Unable to load data while offline.')
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load people')
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadPage()

    return () => {
      cancelled = true
    }
  }, [page, reloadToken, showOfflineModal])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <main>
      <h1>Table</h1>
      {user ? (
        <p>
          Signed in as {user.firstName} {user.lastName} (@{user.username})
        </p>
      ) : null}
      <button type="button" onClick={logout}>
        Logout
      </button>

      {error ? (
        <div className="error-banner">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadToken((token) => token + 1)}>
            Retry
          </button>
        </div>
      ) : null}

      <div className="table-panel">
        {isLoading ? <LoadingOverlay /> : null}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mass</th>
              <th>Height</th>
              <th>Hair color</th>
              <th>Skin color</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.mass}</td>
                <td>{person.height}</td>
                <td>{person.hair_color}</td>
                <td>{person.skin_color}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <button
            type="button"
            disabled={!hasPrevious || isLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>

          <label htmlFor="page-select">
            Page{' '}
            <select
              id="page-select"
              value={page}
              disabled={isLoading || totalCount === 0}
              onChange={(event) => setPage(Number(event.target.value))}
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                return (
                  <option key={pageNumber} value={pageNumber}>
                    {pageNumber}
                  </option>
                )
              })}
            </select>
            {' '}of {totalPages}
          </label>

          <button
            type="button"
            disabled={!hasNext || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  )
}

export default TablePage

import { useEffect, useEffectEvent, useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, Table2 } from 'lucide-react'
import Button from '../../components/Button'
import Header from '../../components/Header'
import LoadingOverlay from '../../components/LoadingOverlay'
import { fetchPeoplePage, type Person } from '../../features/people'
import { useOffline } from '../../providers'
import { isNetworkError } from '../../utils/errors'
import styles from './styles.module.scss'

const PAGE_SIZE = 10

function DashboardPage() {
  const { showOfflineModal } = useOffline()
  const [people, setPeople] = useState<Person[]>([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const notifyOffline = useEffectEvent(() => {
    showOfflineModal()
  })

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
            notifyOffline()
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
  }, [page, reloadToken])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <main className={styles.page}>
      <Header title="Dashboard" icon={Table2} />

      {error ? (
        <div className="error-banner">
          <p>{error}</p>
          <Button
            type="danger"
            variant="text"
            icon={RefreshCw}
            onClick={() => setReloadToken((token) => token + 1)}
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className={styles.panel}>
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

        <div className={styles.pagination}>
          <Button
            variant="text"
            icon={ChevronLeft}
            disabled={!hasPrevious || isLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

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
            </select>{' '}
            of {totalPages}
          </label>

          <Button
            variant="text"
            icon={ChevronRight}
            iconPosition="end"
            disabled={!hasNext || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage

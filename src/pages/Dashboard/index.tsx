import { useEffect, useEffectEvent, useState } from 'react'
import { ChevronLeft, ChevronRight, Info, RefreshCw, Table2, X } from 'lucide-react'
import Button from '../../components/Button'
import Header from '../../components/Header'
import LoadingOverlay from '../../components/LoadingOverlay'
import Modal from '../../components/Modal'
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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

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
              <th className={styles.desktopOnly}>Mass</th>
              <th className={styles.desktopOnly}>Height</th>
              <th className={styles.desktopOnly}>Hair color</th>
              <th className={styles.desktopOnly}>Skin color</th>
              <th className={styles.mobileOnly}>Details</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.name}>
                <td className={styles.nameCell}>{person.name}</td>
                <td className={styles.desktopOnly}>{person.mass}</td>
                <td className={styles.desktopOnly}>{person.height}</td>
                <td className={styles.desktopOnly}>{person.hair_color}</td>
                <td className={styles.desktopOnly}>{person.skin_color}</td>
                <td className={styles.mobileOnly}>
                  <Button
                    type="default"
                    variant="text"
                    icon={Info}
                    aria-label={`Details for ${person.name}`}
                    onClick={() => setSelectedPerson(person)}
                  />
                </td>
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

      <Modal
        open={selectedPerson !== null}
        title={selectedPerson?.name ?? 'Details'}
        type="default"
        onClose={() => setSelectedPerson(null)}
      >
        {selectedPerson ? (
          <>
            <ul className={styles.detailsList}>
              <li className={styles.detailItem}>
                <p className={styles.detailLabel}>Mass</p>
                <p className={styles.detailValue}>{selectedPerson.mass}</p>
              </li>
              <li className={styles.detailItem}>
                <p className={styles.detailLabel}>Height</p>
                <p className={styles.detailValue}>{selectedPerson.height}</p>
              </li>
              <li className={styles.detailItem}>
                <p className={styles.detailLabel}>Hair color</p>
                <p className={styles.detailValue}>{selectedPerson.hair_color}</p>
              </li>
              <li className={styles.detailItem}>
                <p className={styles.detailLabel}>Skin color</p>
                <p className={styles.detailValue}>{selectedPerson.skin_color}</p>
              </li>
            </ul>
            <div className={styles.modalActions}>
              <Button type="default" icon={X} onClick={() => setSelectedPerson(null)}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </main>
  )
}

export default DashboardPage

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from './features/auth'
import { AppProviders } from './providers'
import LoginPage from './pages/LoginPage'
import TablePage from './pages/TablePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/table"
            element={
              <ProtectedRoute>
                <TablePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App

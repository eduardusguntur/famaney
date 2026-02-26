import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import { useAuth } from './hooks/useAuth'
import { useFamily } from './hooks/useFamily'
import { Login } from './components/auth/Login'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { FamilySelector } from './components/family/FamilySelector'
import { InputForm } from './components/expense/InputForm'
import { ExpenseList } from './components/expense/ExpenseList'
import { Dashboard } from './components/dashboard/Dashboard'
import { Settings } from './components/settings/Settings'
import { Navigation } from './components/ui/Navigation'

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const { currentFamily, loading: familyLoading } = useFamily()

  if (authLoading || familyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Login />
  }

  // Logged in but no family selected
  if (!currentFamily) {
    return <FamilySelector />
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<InputForm />} />
          <Route path="/history" element={<ExpenseList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <AppContent />
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

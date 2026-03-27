import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — all wrapped in Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes — we build these next steps */}
          <Route
            path="/filings"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400 font-body">Filings page — coming in Step 11</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/filings/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400 font-body">New Filing wizard — coming in Step 11</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/filings/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400 font-body">Filing detail — coming in Step 12</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400 font-body">Settings — coming in Step 14</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
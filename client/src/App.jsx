import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Filings from "./pages/Filings";
import NewFiling from "./pages/NewFiling";
import FilingDetail from "./pages/FilingDetail";
import Settings from "./pages/Settings";
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
          <Route
            path="/filings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Filings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/filings/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewFiling />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Coming next steps */}
          <Route
            path="/filings/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <FilingDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

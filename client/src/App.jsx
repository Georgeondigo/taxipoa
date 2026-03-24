import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          TaxiPoa 🇰🇪
        </h1>
        <p className="text-slate-500 text-lg">
          KRA Tax Filing Assistant
        </p>
        <p className="text-green-600 font-medium mt-4">
          ✅ Frontend is working
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
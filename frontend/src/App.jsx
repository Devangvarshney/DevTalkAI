import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ActiveSession from './components/ActiveSession'
import Login from './pages/auth/Login'
import Signup from './pages/auth/signup'

function Home() {
  const [sessionActive, setSessionActive] = useState(false)

  return (
    <div className="app-container">
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1>AI Speaking Coach</h1>
        <p>Master English with real-time AI feedback</p>
      </header>

      <main className="fade-in">
        {!sessionActive ? (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>Start a New Session</h2>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
              <button className="btn-icon" style={{ borderRadius: '12px', width: '120px' }}>Casual</button>
              <button className="btn-icon" style={{ borderRadius: '12px', width: '120px' }}>Interview</button>
              <button className="btn-icon" style={{ borderRadius: '12px', width: '120px' }}>Debate</button>
            </div>
            <button className="btn-primary" onClick={() => setSessionActive(true)}>
              Start Speaking Now
            </button>
          </div>
        ) : (
          <ActiveSession onEnd={() => setSessionActive(false)} />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application route */}
        <Route path="/" element={<Home />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Legacy redirect for Next.js style path */}
        <Route path="/auth/login" element={<Navigate to="/login" replace />} />
        <Route path="/auth/signup" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

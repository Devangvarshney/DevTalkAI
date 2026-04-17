import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './page/auth/Login'
import Signup from './page/auth/Signup'
import Home from './page/Home/home'
import Practice from './page/Home/Pratice'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application route */}
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Legacy redirect for Next.js style path */}
        <Route path="/auth/login" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

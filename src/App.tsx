import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { Landing } from './pages/landing/Landing';
import Loader from './components/Loader';

function App() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showLoader && <Loader />}
      <Landing />
    </>
  )
}

export default App

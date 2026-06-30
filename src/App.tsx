import { useState, useEffect } from 'react'
import './App.css'

import { Landing } from './pages/landing/Landing';
import Loader from './components/Loader';
import { useCurrentPath } from './utils/router';
import BlogsList from './pages/blogs/BlogsList';
import BlogDetail from './pages/blogs/BlogDetail';

function App() {
  const [showLoader, setShowLoader] = useState(true)
  const path = useCurrentPath();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const renderContent = () => {
    // Standardise path (lowercase and remove trailing slashes)
    const cleanPath = path.toLowerCase().replace(/\/$/, '');

    if (cleanPath === '/blogs') {
      return <BlogsList />;
    }

    if (cleanPath.startsWith('/blogs/')) {
      const slug = path.substring(7).replace(/\/$/, ''); // extract original case slug
      return <BlogDetail slug={slug} />;
    }

    // Default to Landing page
    return <Landing />;
  };

  return (
    <>
      {showLoader && <Loader />}
      {renderContent()}
    </>
  )
}

export default App

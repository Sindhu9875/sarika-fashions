import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll position whenever the route changes so navigating between
// pages doesn't leave the user stranded halfway down the previous page.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

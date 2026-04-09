import { useState, useEffect, useCallback, useRef } from 'react'

const REFRESH_INTERVAL = 30 // seconds
const ESPN_URL = '/api/espn/apis/site/v2/sports/golf/pga/scoreboard'

export function useEspnData() {
  const [competitors, setCompetitors] = useState([])
  const [lastUpdated, setLastUpdated]   = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [countdown, setCountdown]       = useState(REFRESH_INTERVAL)

  const countdownRef = useRef(REFRESH_INTERVAL)
  const timerRef     = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(ESPN_URL)
      if (!res.ok) throw new Error(`ESPN API returned ${res.status}`)
      const json = await res.json()

      const comps =
        json?.events?.[0]?.competitions?.[0]?.competitors ?? []

      setCompetitors(comps)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
      // Keep existing data — don't wipe the leaderboard on transient error
    } finally {
      setLoading(false)
      // Reset countdown
      countdownRef.current = REFRESH_INTERVAL
      setCountdown(REFRESH_INTERVAL)
    }
  }, [])

  // Auto-refresh every REFRESH_INTERVAL seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Tick countdown every 1s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      countdownRef.current = Math.max(0, countdownRef.current - 1)
      setCountdown(countdownRef.current)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { competitors, lastUpdated, loading, error, countdown, refresh }
}

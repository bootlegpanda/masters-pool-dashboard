import { useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { useEspnData }    from './hooks/useEspnData.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { buildEspnLookup } from './utils/nameUtils.js'
import {
  computeEntryResult,
  rankEntries,
  getLeaderScore,
} from './utils/scoreUtils.js'

import Header             from './components/Header.jsx'
import LiveStreamBanner   from './components/LiveStreamBanner.jsx'
import EntryCard          from './components/EntryCard.jsx'
import StandingCard       from './components/StandingCard.jsx'
import PoolLeaderboard    from './components/PoolLeaderboard.jsx'
import MastersLeaderboard from './components/MastersLeaderboard.jsx'
import MastersFullPage    from './components/MastersFullPage.jsx'
import LoadingSpinner     from './components/LoadingSpinner.jsx'

/**
 * Props:
 *  poolEntries  – array of { name, golfers, tb } objects for this pool
 *  poolTitle    – string shown in the header (e.g. "MASTERS POOL")
 *  defaultEntry – entry name to pre-select on first visit
 *  storageKey   – localStorage key for persisting the selection (unique per pool)
 */
export default function App({ poolEntries, poolTitle, defaultEntry, storageKey }) {
  const { competitors, lastUpdated, loading, error, countdown, refresh } = useEspnData()
  const [selectedName, setSelectedName] = useLocalStorage(storageKey, defaultEntry)
  const [view, setView] = useState('dashboard') // 'dashboard' | 'masters'

  // ── Derived data (memoised for perf) ──────────────────────────────────────

  const espnLookup = useMemo(
    () => buildEspnLookup(competitors),
    [competitors]
  )

  const leaderScore = useMemo(
    () => getLeaderScore(competitors),
    [competitors]
  )

  const allResults = useMemo(
    () => poolEntries.map((e) => computeEntryResult(e, espnLookup)),
    [poolEntries, espnLookup]
  )

  const rankedEntries = useMemo(
    () => rankEntries(allResults, leaderScore),
    [allResults, leaderScore]
  )

  const selectedResult = useMemo(
    () => rankedEntries.find((r) => r.name === selectedName) ?? null,
    [rankedEntries, selectedName]
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading && competitors.length === 0) {
    return <LoadingSpinner />
  }

  // Full Masters leaderboard page
  if (view === 'masters') {
    return (
      <MastersFullPage
        competitors={competitors}
        onBack={() => setView('dashboard')}
      />
    )
  }

  // Main dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        poolEntries={poolEntries}
        poolTitle={poolTitle}
        selectedName={selectedName}
        onSelectEntry={setSelectedName}
        countdown={countdown}
        onRefresh={refresh}
        lastUpdated={lastUpdated}
        error={error}
      />

      <LiveStreamBanner />

      {/* Main grid */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-3 py-4
                        grid gap-4
                        grid-cols-1
                        md:grid-cols-[300px_1fr]
                        xl:grid-cols-[300px_1fr_280px]">

        {/* LEFT: Entry card + standing */}
        <aside className="flex flex-col gap-3">
          <EntryCard result={selectedResult} />
          <StandingCard
            result={selectedResult}
            leaderScore={leaderScore}
            totalEntries={poolEntries.length}
          />
        </aside>

        {/* CENTER: Pool leaderboard */}
        <section className="flex flex-col min-h-[500px]">
          <PoolLeaderboard
            rankedEntries={rankedEntries}
            selectedName={selectedName}
            leaderScore={leaderScore}
          />
        </section>

        {/* RIGHT: Masters leaderboard — only on xl */}
        <aside className="hidden xl:flex flex-col">
          <MastersLeaderboard
            competitors={competitors}
            onViewFull={() => setView('masters')}
          />
        </aside>

        {/* Masters leaderboard below pool on md (spans both cols) */}
        <div className="xl:hidden md:col-span-2">
          <MastersLeaderboard
            competitors={competitors}
            onViewFull={() => setView('masters')}
          />
        </div>
      </main>
    </div>
    <Analytics />
  )
}

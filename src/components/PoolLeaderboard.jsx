import { useState } from 'react'
import LeaderboardRow from './LeaderboardRow.jsx'

/**
 * Center panel: all 101 entries, searchable, selected entry highlighted.
 *
 * Props:
 *  rankedEntries – output of rankEntries()
 *  selectedName  – currently selected entry name
 *  leaderScore   – current tournament leader score (integer)
 */
export default function PoolLeaderboard({ rankedEntries, selectedName, leaderScore }) {
  const [search, setSearch] = useState('')

  const filtered = rankedEntries.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  // Alive entries first, then eliminated
  const alive = filtered.filter((e) => !e.isElim && e.total !== null)
  const elim  = filtered.filter((e) => e.isElim || e.total === null)

  return (
    <div className="bg-masters-green-mid rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-masters-badge flex items-center justify-between gap-3">
        <span className="text-masters-gold font-semibold tracking-wide text-sm uppercase shrink-0">
          Pool Standings
        </span>
        <span className="text-masters-cream/50 text-xs shrink-0">
          {rankedEntries.length} entries
        </span>
        <input
          type="text"
          placeholder="Search entries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 bg-masters-green/60 border border-masters-green-lt/30 rounded px-2 py-1
                     text-sm text-masters-cream placeholder:text-masters-cream/30
                     focus:outline-none focus:border-masters-gold/50"
        />
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest text-masters-cream/40 border-b border-masters-green/40 bg-masters-green/20">
        <span className="w-8 text-right shrink-0">Pos</span>
        <span className="w-24 sm:w-28 shrink-0">Entry</span>
        <span className="w-12 text-right shrink-0">Total</span>
        <span className="hidden sm:flex flex-1 gap-1 text-[10px]">Golfers</span>
        <span className="w-10 text-right shrink-0 hidden md:block">TB1</span>
      </div>

      {/* Rows */}
      <div className="overflow-y-auto leaderboard-scroll flex-1">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-masters-cream/40 text-sm text-center">
            No entries match "{search}"
          </p>
        ) : (
          <>
            {alive.map((entry) => (
              <LeaderboardRow
                key={entry.name}
                entry={entry}
                isSelected={entry.name === selectedName}
                leaderScore={leaderScore}
              />
            ))}

            {elim.length > 0 && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-masters-elim/60 bg-masters-green/10 border-y border-masters-green/30">
                  Eliminated ({elim.length})
                </div>
                {elim.map((entry) => (
                  <LeaderboardRow
                    key={entry.name}
                    entry={entry}
                    isSelected={entry.name === selectedName}
                    leaderScore={leaderScore}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

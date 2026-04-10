import clsx from 'clsx'
import { formatScore } from '../utils/scoreUtils.js'
import { processCompetitor, sortCompetitors, CUT_PROJECTIONS, PROJECTED_CUT } from './MastersLeaderboard.jsx'

/**
 * Full-screen Masters tournament leaderboard.
 *
 * Props:
 *  competitors – raw ESPN array
 *  onBack      – callback to return to dashboard
 */
export default function MastersFullPage({ competitors, onBack }) {
  const sorted = sortCompetitors(competitors.map(processCompetitor))

  // Assign display rank (with ties)
  const ranked = []
  for (let i = 0; i < sorted.length; i++) {
    const g = sorted[i]
    if (g.isMC) {
      ranked.push({ ...g, rankStr: 'MC' })
    } else if (i > 0 && sorted[i].score === sorted[i - 1].score && !sorted[i - 1].isMC) {
      ranked.push({ ...g, rankStr: `T${ranked[i - 1].rankStr.replace('T', '') || i}` })
    } else {
      ranked.push({ ...g, rankStr: `${i + 1}` })
    }
  }

  const made = ranked.filter((g) => !g.isMC)
  const mc   = ranked.filter((g) => g.isMC)

  // Map of index → cut projection to insert AFTER that player (after last player at each cut score)
  const cutAfterIndex = new Map()
  for (const proj of CUT_PROJECTIONS) {
    let last = -1
    for (let i = 0; i < made.length; i++) {
      if (made[i].score === proj.score) last = i
    }
    if (last >= 0) cutAfterIndex.set(last, proj)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page header */}
      <div className="bg-masters-badge border-b border-masters-gold/20 px-4 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-masters-gold hover:text-masters-gold-lt transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-masters-gold font-extrabold tracking-wide">
            THE MASTERS 2026 — FULL LEADERBOARD
          </h1>
        </div>
        <span className="text-masters-cream/40 text-xs">{competitors.length} players</span>
      </div>

      {/* Table */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 py-4">
        <div className="bg-masters-green-mid rounded-xl overflow-hidden shadow-lg">
          {/* Column headers */}
          <div className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest text-masters-cream/40 bg-masters-badge border-b border-masters-green/40">
            <span className="w-10 text-right shrink-0">Pos</span>
            <span className="flex-1">Player</span>
            <span className="w-14 text-right shrink-0">Total</span>
            <span className="w-10 text-right shrink-0">Thru</span>
          </div>

          <div className="overflow-y-auto">
            {made.map((g, i) => (
              <div key={g.name}>
                <div className="flex items-center gap-3 px-4 py-2 border-b border-masters-green/20 hover:bg-masters-green/20 transition-colors">
                  <span className="w-10 text-right text-masters-gold/70 text-sm font-medium shrink-0 tabular-nums">
                    {g.rankStr}
                  </span>
                  <span className="flex-1 text-masters-cream text-sm">{g.name}</span>
                  <span
                    className={clsx(
                      'w-14 text-right font-bold tabular-nums text-sm shrink-0',
                      g.score < 0
                        ? 'text-green-400'
                        : g.score > 0
                        ? 'text-red-400'
                        : 'text-masters-cream'
                    )}
                  >
                    {formatScore(g.score)}
                  </span>
                  <span className="w-10 text-right text-masters-cream/50 text-xs tabular-nums shrink-0">
                    {g.thru}
                  </span>
                </div>
                {cutAfterIndex.has(i) && (() => {
                  const proj = cutAfterIndex.get(i)
                  return (
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-900/20 border-y border-red-700/30">
                      <span className="text-red-400 font-bold text-xs uppercase tracking-widest shrink-0">
                        ✂ Cut if +{proj.score}
                      </span>
                      <span className="flex-1" />
                      <span className="text-red-300/60 text-xs tabular-nums shrink-0">
                        {proj.pct}%
                      </span>
                    </div>
                  )
                })()}
              </div>
            ))}

            {mc.length > 0 && (
              <>
                <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-masters-elim/60 bg-masters-green/10 border-y border-masters-green/30">
                  Missed Cut ({mc.length})
                </div>
                {mc.map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center gap-3 px-4 py-1.5 border-b border-masters-green/10 opacity-50"
                  >
                    <span className="w-10 text-right text-masters-elim text-sm shrink-0">MC</span>
                    <span className="flex-1 text-masters-cream/70 text-sm">{g.name}</span>
                    <span className="w-14 text-right text-red-400/70 font-bold tabular-nums text-sm shrink-0">MC</span>
                    <span className="w-10 text-right text-masters-cream/30 text-xs shrink-0">--</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

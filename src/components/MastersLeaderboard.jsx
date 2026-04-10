import clsx from 'clsx'
import { formatScore, parseScore } from '../utils/scoreUtils.js'

// Projected cut line probabilities (hardcoded, update as needed)
export const CUT_PROJECTIONS = [
  { score: 3, pct: 28.0 },
  { score: 4, pct: 55.8 },
  { score: 5, pct: 14.4 },
]
// The most likely cut score
export const PROJECTED_CUT = CUT_PROJECTIONS.reduce((a, b) => a.pct > b.pct ? a : b).score

/** Shared helper: map a raw ESPN competitor → display object */
export function processCompetitor(c) {
  const score = parseScore(c.score ?? 'E')
  const name  = c.athlete?.displayName ?? 'Unknown'

  const rounds = c.linescores ?? []
  const roundLinescores = (rounds[rounds.length - 1]?.linescores) ?? []
  const holesPlayed = roundLinescores.length
  const isFinished  =
    c.status?.type?.shortDetail === 'F' ||
    c.status?.type?.name === 'STATUS_COMPLETE' ||
    holesPlayed === 18

  let thru = '--'
  if (isFinished)           thru = 'F'
  else if (holesPlayed > 0) thru = `${holesPlayed}`

  const isMC = score === null
  return { name, score, thru, isMC }
}

/** Shared sort: best (lowest) score first; MC to bottom */
export function sortCompetitors(list) {
  return [...list].sort((a, b) => {
    if (a.score === null && b.score === null) return 0
    if (a.score === null) return 1
    if (b.score === null) return -1
    return a.score - b.score
  })
}

/** Projected cut divider row — shown before each cut score group */
function CutlineDivider({ proj, compact = false }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border-y border-red-700/30">
      <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest shrink-0">
        ✂ Cut if +{proj.score}
      </span>
      {!compact && (
        <span className="text-red-300/50 text-[10px]">({proj.pct}%)</span>
      )}
      <span className="flex-1" />
      <span className="text-red-300/60 text-[10px] tabular-nums shrink-0">
        {proj.pct}%
      </span>
    </div>
  )
}

/**
 * Right sidebar — top N from the ESPN competitors array.
 *
 * Props:
 *  competitors  – raw ESPN array
 *  limit        – max rows to show (default 20)
 *  onViewFull   – callback to switch to full leaderboard page
 */
export default function MastersLeaderboard({ competitors, limit = 20, onViewFull }) {
  const sorted = sortCompetitors(competitors.map(processCompetitor)).slice(0, limit)

  // Map of index → cut projection to insert AFTER that player (after last player at each cut score)
  const cutAfterIndex = new Map()
  for (const proj of CUT_PROJECTIONS) {
    let last = -1
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].score === proj.score) last = i
    }
    if (last >= 0) cutAfterIndex.set(last, proj)
  }

  return (
    <div className="bg-masters-green-mid rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-masters-badge flex items-center justify-between">
        <span className="text-masters-gold font-semibold tracking-wide text-sm uppercase">
          Masters Leaderboard
        </span>
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="text-xs text-masters-gold/60 hover:text-masters-gold transition-colors underline underline-offset-2"
          >
            Full leaderboard →
          </button>
        )}
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-widest text-masters-cream/40 border-b border-masters-green/40">
        <span className="w-6 text-right shrink-0">#</span>
        <span className="flex-1">Player</span>
        <span className="w-10 text-right shrink-0">Score</span>
        <span className="w-8 text-right shrink-0">Thru</span>
      </div>

      <div className="overflow-y-auto leaderboard-scroll flex-1">
        {sorted.length === 0 ? (
          <p className="px-4 py-6 text-masters-cream/40 text-sm text-center">
            No data yet
          </p>
        ) : (
          sorted.map((g, i) => (
            <div key={g.name}>
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-masters-green/20 text-sm hover:bg-masters-green/20 transition-colors">
                <span className="w-6 text-right text-masters-gold/60 text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-masters-cream">{g.name}</span>
                <span
                  className={clsx(
                    'w-10 text-right font-semibold tabular-nums shrink-0',
                    g.isMC
                      ? 'text-red-400'
                      : g.score !== null && g.score < 0
                      ? 'text-green-400'
                      : g.score !== null && g.score > 0
                      ? 'text-red-400'
                      : 'text-masters-cream'
                  )}
                >
                  {g.isMC ? 'MC' : formatScore(g.score)}
                </span>
                <span className="w-8 text-right text-masters-cream/50 text-xs tabular-nums shrink-0">
                  {g.thru}
                </span>
              </div>
              {cutAfterIndex.has(i) && (
                <CutlineDivider proj={cutAfterIndex.get(i)} compact />
              )}
            </div>
          ))
        )}
      </div>

      {onViewFull && sorted.length > 0 && (
        <button
          onClick={onViewFull}
          className="py-2 text-xs text-masters-gold/60 hover:text-masters-gold hover:bg-masters-green/20 transition-colors border-t border-masters-green/30"
        >
          View full leaderboard ({competitors.length} players)
        </button>
      )}
    </div>
  )
}

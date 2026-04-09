import clsx from 'clsx'
import { formatScore } from '../utils/scoreUtils.js'

/**
 * Shows the selected entry's current pool standing.
 *
 * Props:
 *  result      – ranked entry object (from rankEntries output)
 *  leaderScore – integer: current tournament leader score
 *  totalEntries– integer: total entries in pool
 */
export default function StandingCard({ result, leaderScore, totalEntries }) {
  if (!result) return null

  const { rank, tied, isElim, total, tb1, tb2Score, golfers, droppedIndex, name } = result

  const tb1Diff  = Math.abs(tb1 - (leaderScore ?? 0))
  const rankStr  = isElim ? 'ELIM' : rank === null ? '--' : tied ? `T-${rank}` : `${rank}`

  const droppedGolfer = golfers?.[droppedIndex]

  return (
    <div className="bg-masters-green-mid rounded-xl overflow-hidden shadow-lg mt-3">
      <div className="px-4 py-3 bg-masters-badge">
        <span className="text-masters-gold font-semibold tracking-wide text-sm uppercase">
          Pool Standing
        </span>
      </div>

      <div className="p-4 flex items-start gap-4">
        {/* Big rank */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span
            className={clsx(
              'text-4xl font-extrabold leading-none',
              isElim ? 'text-masters-elim' : 'text-masters-gold'
            )}
          >
            {rankStr}
          </span>
          {!isElim && totalEntries && (
            <span className="text-masters-cream/40 text-xs mt-1">of {totalEntries}</span>
          )}
        </div>

        {/* Stats column */}
        <div className="flex-1 space-y-2 text-sm">
          {/* Total */}
          <div className="flex justify-between">
            <span className="text-masters-cream/60">Total</span>
            <span
              className={clsx(
                'font-bold tabular-nums',
                isElim
                  ? 'text-masters-elim'
                  : total === null
                  ? 'text-masters-cream/40'
                  : total < 0
                  ? 'text-green-400'
                  : total > 0
                  ? 'text-red-400'
                  : 'text-masters-cream'
              )}
            >
              {isElim ? 'ELIM' : formatScore(total)}
            </span>
          </div>

          {/* TB1 */}
          <div className="flex justify-between">
            <span className="text-masters-cream/60">TB1 (winner pick)</span>
            <span className="text-masters-cream tabular-nums">
              {formatScore(tb1)}
              <span className="text-masters-cream/40 ml-1 text-xs">
                ({tb1Diff === 0 ? 'exact' : `-${tb1Diff}`})
              </span>
            </span>
          </div>

          {/* TB2 */}
          {droppedGolfer && (
            <div className="flex justify-between">
              <span className="text-masters-cream/60">TB2 (dropped)</span>
              <span className="text-masters-cream tabular-nums">
                {droppedGolfer.shortName}{' '}
                <span
                  className={clsx(
                    'ml-1',
                    droppedGolfer.isMC
                      ? 'text-red-400'
                      : droppedGolfer.score !== null && droppedGolfer.score < 0
                      ? 'text-green-400'
                      : droppedGolfer.score !== null && droppedGolfer.score > 0
                      ? 'text-red-400'
                      : 'text-masters-cream'
                  )}
                >
                  {droppedGolfer.isMC ? 'MC' : formatScore(droppedGolfer.score)}
                </span>
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="flex justify-between">
            <span className="text-masters-cream/60">Status</span>
            <span
              className={clsx(
                'text-xs px-2 py-0.5 rounded font-semibold',
                isElim
                  ? 'bg-red-700/60 text-red-200'
                  : 'bg-green-800/60 text-green-300'
              )}
            >
              {isElim ? 'ELIMINATED' : 'ALIVE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

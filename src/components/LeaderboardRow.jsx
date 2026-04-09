import { useState } from 'react'
import clsx from 'clsx'
import { formatScore } from '../utils/scoreUtils.js'

/**
 * Single row in the pool leaderboard table.
 * Click the row to expand and see each golfer's score.
 *
 * Props:
 *  entry        – ranked result object
 *  isSelected   – bool: highlight as user's entry
 *  leaderScore  – integer: current tournament leader score (for TB1 diff)
 */
export default function LeaderboardRow({ entry, isSelected, leaderScore }) {
  const [expanded, setExpanded] = useState(false)

  const {
    rank, tied, isElim, total,
    tb1, golfers, droppedIndex, name, mcCount,
  } = entry

  const rankStr = isElim ? '—' : rank === null ? '—' : tied ? `T${rank}` : `${rank}`
  const tb1Diff = Math.abs(tb1 - (leaderScore ?? 0))

  return (
    <div className="border-b border-masters-green/30">
      {/* ── Main row ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none transition-colors',
          isSelected
            ? 'bg-masters-gold/20'
            : isElim
            ? 'opacity-40'
            : 'hover:bg-masters-green/20'
        )}
      >
        {/* Rank */}
        <span
          className={clsx(
            'w-8 text-right font-bold tabular-nums shrink-0',
            isSelected ? 'text-masters-gold' : isElim ? 'text-masters-elim' : 'text-masters-cream/70'
          )}
        >
          {rankStr}
        </span>

        {/* Entry name */}
        <span
          className={clsx(
            'w-24 sm:w-28 truncate font-medium shrink-0',
            isSelected ? 'text-masters-gold' : isElim ? 'text-masters-elim' : 'text-masters-cream'
          )}
        >
          {name}
          {isSelected && <span className="ml-1 text-[10px] text-masters-gold">★</span>}
        </span>

        {/* Total */}
        <span
          className={clsx(
            'w-12 text-right font-bold tabular-nums shrink-0',
            isElim
              ? 'text-masters-elim'
              : total === null
              ? 'text-masters-cream/30'
              : total < 0
              ? 'text-green-400'
              : total > 0
              ? 'text-red-400'
              : 'text-masters-cream'
          )}
        >
          {isElim ? 'ELIM' : formatScore(total)}
        </span>

        {/* Golfer scores — hidden on very small screens */}
        <div className="hidden sm:flex gap-1 flex-1">
          {golfers?.map((g, i) => {
            const isDropped = i === droppedIndex
            return (
              <span
                key={g.shortName}
                className={clsx(
                  'text-xs tabular-nums px-1 rounded',
                  isDropped
                    ? 'opacity-30 line-through'
                    : g.isMC
                    ? 'text-red-400'
                    : g.score !== null && g.score < 0
                    ? 'text-green-400'
                    : g.score !== null && g.score > 0
                    ? 'text-red-400'
                    : 'text-masters-cream/70'
                )}
                title={g.shortName}
              >
                {g.isMC ? 'MC' : formatScore(g.score)}
              </span>
            )
          })}
        </div>

        {/* TB1 diff */}
        <span className="w-10 text-right text-masters-cream/40 text-xs tabular-nums shrink-0 hidden md:block">
          {tb1Diff === 0 ? '✓' : `-${tb1Diff}`}
        </span>

        {/* MC count badge */}
        {mcCount > 0 && (
          <span className="text-[10px] bg-red-700/40 text-red-300 rounded px-1 shrink-0">
            {mcCount}MC
          </span>
        )}

        {/* Expand chevron */}
        <span className={clsx(
          'ml-auto text-masters-cream/30 text-xs transition-transform shrink-0',
          expanded && 'rotate-180'
        )}>
          ▾
        </span>
      </div>

      {/* ── Expanded golfer detail ── */}
      {expanded && (
        <div className={clsx(
          'px-4 pb-3 pt-1 grid grid-cols-2 gap-x-4 gap-y-1',
          isSelected ? 'bg-masters-gold/10' : 'bg-masters-green/10'
        )}>
          {golfers?.map((g, i) => {
            const isDropped = i === droppedIndex
            return (
              <div
                key={g.shortName}
                className={clsx(
                  'flex items-center justify-between text-xs py-0.5',
                  isDropped && 'opacity-40'
                )}
              >
                <span className={clsx(
                  'truncate',
                  isDropped ? 'line-through text-masters-cream/50' : 'text-masters-cream'
                )}>
                  {g.shortName}
                  {isDropped && <span className="ml-1 text-[10px] text-masters-elim">(dropped)</span>}
                </span>
                <span className={clsx(
                  'ml-2 font-semibold tabular-nums shrink-0',
                  g.isMC
                    ? 'text-red-400'
                    : g.score !== null && g.score < 0
                    ? 'text-green-400'
                    : g.score !== null && g.score > 0
                    ? 'text-red-400'
                    : 'text-masters-cream/80'
                )}>
                  {g.isMC ? 'MC' : formatScore(g.score)}
                  {g.thru && g.thru !== '--' && (
                    <span className="text-masters-cream/30 ml-1">({g.thru})</span>
                  )}
                </span>
              </div>
            )
          })}
          <div className="col-span-2 mt-1 pt-1 border-t border-masters-green/30 flex justify-between text-[10px] text-masters-cream/40">
            <span>TB1 pick: {formatScore(tb1)}</span>
            <span>{tb1Diff === 0 ? 'Exact match' : `-${tb1Diff} from leader`}</span>
          </div>
        </div>
      )}
    </div>
  )
}

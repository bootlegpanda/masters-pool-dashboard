import clsx from 'clsx'
import GolferRow from './GolferRow.jsx'
import { formatScore } from '../utils/scoreUtils.js'

/**
 * Shows the selected entry's 4 golfers, scores, thru, and summary.
 * result = computeEntryResult() output
 */
export default function EntryCard({ result }) {
  if (!result) {
    return (
      <div className="bg-masters-green-mid rounded-xl p-4 text-masters-cream/50 text-sm">
        Select an entry to view details.
      </div>
    )
  }

  const { name, golfers, droppedIndex, isElim, total } = result

  return (
    <div className="bg-masters-green-mid rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 bg-masters-badge flex items-center justify-between">
        <span className="text-masters-gold font-semibold tracking-wide text-sm uppercase">
          Your Lineup
        </span>
        <span className="text-masters-cream font-bold">{name}</span>
      </div>

      {/* ELIM banner */}
      {isElim && (
        <div className="bg-red-700/80 text-white text-xs font-bold uppercase tracking-widest text-center py-1.5">
          ⚠ Eliminated — 2 or more golfers missed the cut
        </div>
      )}

      {/* Golfer rows */}
      <div className="py-2 divide-y divide-masters-green/40">
        {/* Column headers */}
        <div className="flex items-center gap-2 px-3 pb-1 text-[10px] uppercase tracking-widest text-masters-cream/40">
          <span className="flex-1">Golfer</span>
          <span className="w-10 text-right">Score</span>
          <span className="w-8 text-right">Thru</span>
        </div>

        {golfers.map((g, i) => (
          <GolferRow
            key={g.shortName}
            name={g.shortName}
            score={g.score}
            thru={g.thru}
            isDropped={i === droppedIndex}
            isMC={g.isMC}
          />
        ))}
      </div>

      {/* Total */}
      <div className="px-4 py-3 bg-masters-green/50 flex items-center justify-between">
        <span className="text-masters-cream/60 text-sm">Pool Total</span>
        <span
          className={clsx(
            'text-xl font-bold tabular-nums',
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
    </div>
  )
}

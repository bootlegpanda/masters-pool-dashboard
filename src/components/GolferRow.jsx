import clsx from 'clsx'
import { formatScore } from '../utils/scoreUtils.js'

/**
 * Shared golfer row used in EntryCard and MastersLeaderboard.
 *
 * Props:
 *  name        – display name string
 *  score       – integer or null
 *  thru        – string ('F', '14', '--')
 *  isDropped   – bool; dims the row and shows "dropped" badge
 *  isMC        – bool; shows MC badge in score cell
 *  rank        – optional integer rank (for Masters leaderboard view)
 */
export default function GolferRow({ name, score, thru, isDropped, isMC, rank }) {
  const scoreDisplay = isMC ? 'MC' : formatScore(score)

  const scoreColor = clsx({
    'text-green-400':  !isMC && score !== null && score < 0,
    'text-red-400':    isMC || (score !== null && score > 0),
    'text-masters-cream': !isMC && score === 0,
    'text-masters-elim':  score === null && !isMC,
  })

  return (
    <div
      className={clsx(
        'flex items-center gap-2 px-3 py-1.5 rounded text-sm',
        isDropped ? 'opacity-40' : 'opacity-100'
      )}
    >
      {rank !== undefined && (
        <span className="w-6 text-right text-masters-gold/70 text-xs">{rank}</span>
      )}

      <span className="flex-1 truncate text-masters-cream">{name}</span>

      {isDropped && (
        <span className="text-[10px] uppercase tracking-wider text-masters-elim border border-masters-elim/50 rounded px-1">
          dropped
        </span>
      )}

      <span className={clsx('w-10 text-right font-semibold tabular-nums', scoreColor)}>
        {scoreDisplay}
      </span>

      <span className="w-8 text-right text-masters-cream/50 text-xs tabular-nums">
        {thru}
      </span>
    </div>
  )
}

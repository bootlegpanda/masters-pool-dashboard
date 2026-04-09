// Parse an ESPN score string to an integer relative to par.
// Returns null for MC/WD/DQ (treated as missed cut).
export function parseScore(scoreStr) {
  if (!scoreStr || scoreStr === 'E') return 0
  if (['CUT','WD','DQ','MC','MDF'].includes(scoreStr.toUpperCase())) return null
  const n = parseInt(scoreStr, 10)
  return isNaN(n) ? null : n
}

// Format an integer score back to display string.
export function formatScore(score) {
  if (score === null || score === undefined) return '--'
  if (score === 0) return 'E'
  if (score > 0) return `+${score}`
  return `${score}`
}

// CSS class for a score value
export function scoreClass(score) {
  if (score === null) return 'score-mc'
  if (score < 0) return 'score-under'
  if (score > 0) return 'score-over'
  return 'score-even'
}

// Compute the full result for a single pool entry given the ESPN lookup map.
// espnLookup: Map<poolShortName, { score: number|null, thru: string, espnName: string }>
export function computeEntryResult(entry, espnLookup) {
  const golferResults = entry.golfers.map((shortName) => {
    const data = espnLookup.get(shortName)
    return {
      shortName,
      score: data?.score ?? null,
      thru: data?.thru ?? '--',
      isMC: data !== undefined && data.score === null,
      notFound: data === undefined,
    }
  })

  const mcCount = golferResults.filter((g) => g.isMC).length
  const isElim = mcCount >= 2

  // Sort a copy by score descending (highest/worst score first).
  // null (MC) = treated as worst.
  const sorted = [...golferResults].sort((a, b) => {
    if (a.score === null && b.score === null) return 0
    if (a.score === null) return -1  // null is worst → goes first in descending
    if (b.score === null) return 1
    return b.score - a.score        // higher score = worse = first
  })

  // The first element after sorting worst-first is the dropped golfer.
  const droppedShortName = sorted[0].shortName
  const droppedIndex = entry.golfers.indexOf(droppedShortName)

  // Sum the 3 best non-null scores (skip MC golfers since they'd skew total)
  const scoreable = golferResults
    .filter((g) => !g.isMC && g.score !== null)
    .map((g) => g.score)
    .sort((a, b) => a - b)  // ascending: best first
    .slice(0, 3)

  const total = isElim
    ? null
    : scoreable.length > 0
      ? scoreable.reduce((s, v) => s + v, 0)
      : null

  const tb2Score = golferResults[droppedIndex]?.score ?? null

  return {
    name: entry.name,
    golfers: golferResults,
    droppedIndex,
    isElim,
    mcCount,
    total,       // sum of best 3 (integer) or null if ELIM/no scores
    tb1: entry.tb,
    tb2Score,
  }
}

// Rank all 101 entries. leaderScore is the current tournament leader's score (integer).
export function rankEntries(results, leaderScore) {
  const score = leaderScore ?? 0

  const alive = results.filter((r) => !r.isElim && r.total !== null)
  const elim  = results.filter((r) => r.isElim || r.total === null)

  const sortFn = (a, b) => {
    // 1. Total score ascending (lower = better)
    if (a.total !== b.total) return (a.total ?? 999) - (b.total ?? 999)
    // 2. TB1: closest winner score prediction (smaller absolute diff wins)
    const aDiff = Math.abs(a.tb1 - score)
    const bDiff = Math.abs(b.tb1 - score)
    if (aDiff !== bDiff) return aDiff - bDiff
    // 3. TB2: dropped golfer score, lower is better
    return (a.tb2Score ?? 99) - (b.tb2Score ?? 99)
  }

  alive.sort(sortFn)
  elim.sort(sortFn)

  // Assign ranks with ties
  const ranked = []
  let rank = 1
  for (let i = 0; i < alive.length; i++) {
    if (i > 0 && alive[i].total === alive[i - 1].total) {
      ranked.push({ ...alive[i], rank: ranked[i - 1].rank, tied: true })
    } else {
      ranked.push({ ...alive[i], rank, tied: false })
      rank = i + 2
    }
  }

  const elimRanked = elim.map((r) => ({ ...r, rank: null }))
  return [...ranked, ...elimRanked]
}

// Return the current tournament leader's score (lowest integer)
export function getLeaderScore(competitors) {
  let best = 0
  for (const comp of competitors) {
    const s = parseScore(comp.score ?? 'E')
    if (s !== null && s < best) best = s
  }
  return best
}

import { NAME_MAP } from '../data/nameMap.js'
import { parseScore } from './scoreUtils.js'

// Build a Map<poolShortName, { score, thru, espnName }> from ESPN competitors array.
export function buildEspnLookup(competitors) {
  // Invert NAME_MAP: ESPN displayName → pool short name
  const espnToPool = {}
  for (const [pool, espn] of Object.entries(NAME_MAP)) {
    espnToPool[espn] = pool
  }

  const lookup = new Map()

  for (const comp of competitors) {
    const espnName = comp.athlete?.displayName ?? ''
    const poolName = espnToPool[espnName]
    if (!poolName) continue

    const score = parseScore(comp.score ?? 'E')

    // Thru: use the last round in the array (current round, not always round 1)
    const rounds = comp.linescores ?? []
    const roundLinescores = (rounds[rounds.length - 1]?.linescores) ?? []
    const holesPlayed = roundLinescores.length
    const isFinished =
      comp.status?.type?.shortDetail === 'F' ||
      comp.status?.type?.name === 'STATUS_COMPLETE' ||
      holesPlayed === 18

    let thru = '--'
    if (isFinished) {
      thru = 'F'
    } else if (holesPlayed > 0) {
      thru = `${holesPlayed}`
    }

    lookup.set(poolName, { score, thru, espnName })
  }

  return lookup
}

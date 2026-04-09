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

    // Thru: count nested hole linescores in the current round
    const roundLinescores = comp.linescores?.[0]?.linescores ?? []
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

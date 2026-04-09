import RefreshTimer from './RefreshTimer.jsx'

/**
 * Top header bar.
 *
 * Props:
 *  poolEntries   – array of entry objects (populates the selector dropdown)
 *  poolTitle     – string displayed as the dashboard title
 *  selectedName  – currently selected entry name
 *  onSelectEntry – callback(name)
 *  countdown     – seconds until next refresh
 *  onRefresh     – manual refresh callback
 *  lastUpdated   – Date | null
 *  error         – string | null
 */
export default function Header({
  poolEntries,
  poolTitle,
  selectedName,
  onSelectEntry,
  countdown,
  onRefresh,
  lastUpdated,
  error,
}) {
  return (
    <header className="bg-masters-badge border-b border-masters-gold/20 px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-3">
        {/* Logo / title */}
        <div className="flex items-center gap-2 mr-2">
          <span className="text-2xl">⛳</span>
          <div>
            <h1 className="text-masters-gold font-extrabold text-base leading-tight tracking-wide">
              {poolTitle}
            </h1>
            <p className="text-masters-cream/50 text-[10px] uppercase tracking-widest leading-tight">
              2026 · Live Dashboard
            </p>
          </div>
        </div>

        {/* Entry selector */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <label className="text-masters-cream/60 text-xs whitespace-nowrap shrink-0">
            Your entry:
          </label>
          <select
            value={selectedName}
            onChange={(e) => onSelectEntry(e.target.value)}
            className="flex-1 min-w-0 bg-masters-green border border-masters-green-lt/40 rounded px-2 py-1
                       text-sm text-masters-cream
                       focus:outline-none focus:border-masters-gold/60
                       appearance-none cursor-pointer"
          >
            {poolEntries.map((e) => (
              <option key={e.name} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh timer */}
        <RefreshTimer
          countdown={countdown}
          onRefresh={onRefresh}
          lastUpdated={lastUpdated}
        />

        {/* Error banner */}
        {error && (
          <div className="w-full text-xs text-red-300 bg-red-900/30 border border-red-700/40 rounded px-3 py-1">
            ⚠ Score fetch error: {error} — showing last known data
          </div>
        )}
      </div>
    </header>
  )
}

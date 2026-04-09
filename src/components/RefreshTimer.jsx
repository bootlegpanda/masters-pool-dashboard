const REFRESH_INTERVAL = 30

export default function RefreshTimer({ countdown, onRefresh, lastUpdated }) {
  const pct = (countdown / REFRESH_INTERVAL) * 100

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <div className="flex items-center gap-3">
      {/* Countdown bar + text */}
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-masters-green rounded-full overflow-hidden">
          <div
            className="h-full bg-masters-gold rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-masters-cream/60 text-xs tabular-nums whitespace-nowrap">
          {countdown}s
        </span>
      </div>

      {/* Manual refresh button */}
      <button
        onClick={onRefresh}
        className="flex items-center gap-1 text-xs text-masters-gold hover:text-masters-gold-lt transition-colors"
        title="Refresh now"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.11-3.46L10 6h5V1l-1.35 1.35z"/>
        </svg>
        Refresh
      </button>

      {timeStr && (
        <span className="text-masters-cream/40 text-xs hidden sm:block">
          Updated {timeStr}
        </span>
      )}
    </div>
  )
}

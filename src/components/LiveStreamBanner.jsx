const LINKS = [
  {
    label: '⛳ Watch Live',
    url: 'https://www.masters.com/en_US/live/index.html',
    title: 'Masters.com Live Stream',
  },
  {
    label: '📺 CBS Sports',
    url: 'https://www.cbssports.com/golf/masters/',
    title: 'CBS Sports Masters Coverage',
  },
  {
    label: '🏌️ ESPN',
    url: 'https://www.espn.com/golf/leaderboard',
    title: 'ESPN Golf Leaderboard',
  },
]

export default function LiveStreamBanner() {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-masters-badge border-b border-masters-gold/20">
      <span className="text-masters-gold/70 text-xs uppercase tracking-widest font-medium mr-1">
        Live
      </span>
      {LINKS.map(({ label, url, title }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          className="text-xs px-3 py-1 rounded border border-masters-gold/40 text-masters-gold
                     hover:bg-masters-gold hover:text-masters-green transition-colors font-medium"
        >
          {label}
        </a>
      ))}
    </div>
  )
}

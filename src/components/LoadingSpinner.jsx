export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-masters-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-masters-gold text-sm tracking-widest uppercase">
        Loading scores…
      </p>
    </div>
  )
}

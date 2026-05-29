export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass p-8 rounded-2xl">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-dark p-6 rounded-xl">
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-8 w-12 bg-white/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="mt-8 space-y-4">
            <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

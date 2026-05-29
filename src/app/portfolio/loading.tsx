export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-cyber-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-14 space-y-4">
          <div className="h-6 w-32 mx-auto bg-white/5 rounded-full animate-pulse" />
          <div className="h-12 w-64 mx-auto bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full mx-auto bg-white/5 rounded animate-pulse mt-6" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="aspect-video bg-white/5 animate-pulse" />
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category */}
                <div className="h-5 w-20 bg-white/5 rounded-full animate-pulse" />
                
                {/* Title */}
                <div className="h-7 w-full bg-white/5 rounded animate-pulse" />
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-6 w-14 bg-white/5 rounded-full animate-pulse" />
                </div>
                
                {/* CTA */}
                <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

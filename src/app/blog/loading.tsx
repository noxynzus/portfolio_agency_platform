export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-cyber-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-14 space-y-4">
          <div className="h-6 w-32 mx-auto bg-white/5 rounded-full animate-pulse" />
          <div className="h-12 w-48 mx-auto bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full mx-auto bg-white/5 rounded animate-pulse mt-6" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article
              key={i}
              className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col"
            >
              {/* Featured Image Skeleton */}
              <div className="aspect-[16/9] bg-white/5 animate-pulse" />
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-6 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-6 w-4/5 bg-white/5 rounded animate-pulse" />
                </div>
                
                {/* Excerpt */}
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                </div>
                
                {/* Read More Button */}
                <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse mt-auto" />
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2 mt-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-10 h-10 bg-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

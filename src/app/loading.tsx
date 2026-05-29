export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Hero Section Skeleton */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {/* Eyebrow */}
          <div className="h-6 w-48 mx-auto bg-white/5 rounded-full animate-pulse" />
          
          {/* Title */}
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 rounded-lg animate-pulse" />
            <div className="h-16 w-3/4 mx-auto bg-white/5 rounded-lg animate-pulse" />
          </div>
          
          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 w-full max-w-2xl mx-auto bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-5/6 mx-auto bg-white/5 rounded animate-pulse" />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <div className="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-12 w-36 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Projects Section Skeleton */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14 space-y-4">
            <div className="h-6 w-32 mx-auto bg-white/5 rounded-full animate-pulse" />
            <div className="h-10 w-64 mx-auto bg-white/5 rounded-lg animate-pulse" />
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass p-6 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="aspect-video bg-white/5 rounded-lg animate-pulse" />
                <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section Skeleton */}
      <section className="py-24 px-4 bg-cyber-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <div className="h-6 w-32 mx-auto bg-white/5 rounded-full animate-pulse" />
            <div className="h-10 w-48 mx-auto bg-white/5 rounded-lg animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass p-8 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-6 w-2/3 bg-white/5 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

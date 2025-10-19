export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 glass-strong rounded w-3/4"></div>
      <div className="h-4 glass-strong rounded w-1/2"></div>
      <div className="space-y-3">
        <div className="h-4 glass-strong rounded"></div>
        <div className="h-4 glass-strong rounded w-5/6"></div>
        <div className="h-4 glass-strong rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function CardSkeletonLoader() {
  return (
    <div className="glass-strong rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 glass rounded w-1/3"></div>
        <div className="h-6 w-6 glass rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 glass rounded w-full"></div>
        <div className="h-4 glass rounded w-5/6"></div>
        <div className="h-4 glass rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function ProgressSkeletonLoader() {
  return (
    <div className="glass-strong rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 glass rounded w-32 mb-2"></div>
          <div className="h-4 glass rounded w-24"></div>
        </div>
        <div className="w-24 h-24 glass rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 glass rounded w-full"></div>
        <div className="h-4 glass rounded w-3/4"></div>
      </div>
    </div>
  );
}

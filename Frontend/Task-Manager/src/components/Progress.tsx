interface ProgressProps {
  progress: number;
  status: string;
}

const Progress = ({ progress, status }: ProgressProps) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-blue-400/40";
      case "Completed":
        return "bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-green-400/40";
      default: // Pending
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-400/40";
    }
  };

  const getTrackColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-gradient-to-r from-blue-900/40 to-blue-800/40";
      case "Completed":
        return "bg-gradient-to-r from-green-900/40 to-green-800/40";
      default:
        return "bg-gradient-to-r from-yellow-900/40 to-yellow-800/40";
    }
  };

  const getGlowEffect = () => {
    if (progress === 100) {
      return "shadow-lg shadow-green-400/50 animate-pulse";
    }
    return "shadow-md";
  };

  return (
    <div className="relative w-full">
      {/* Progress track */}
      <div
        className={`w-full ${getTrackColor()} rounded-full h-2 overflow-hidden border border-gray-600/20`}>
        {/* Progress bar */}
        <div
          className={`${getColor()} h-2 rounded-full transition-all duration-1000 ease-out ${getGlowEffect()} relative overflow-hidden`}
          style={{ width: `${Math.min(progress, 100)}%` }}>
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

          {/* Completion pulse effect */}
          {progress === 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 via-green-200/30 to-green-300/30 animate-pulse"></div>
          )}
        </div>

        {/* Progress indicator dots for visual interest */}
        {progress > 0 && progress < 100 && (
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
        )}
      </div>

      {/* Progress percentage tooltip on hover */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default Progress;

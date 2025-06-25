interface ProgressProps {
  progress: number;
  status: string;
}

const Progress = ({ progress, status }: ProgressProps) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 shadow-blue-400/30";
      case "Completed":
        return "bg-gradient-to-r from-green-400 via-green-300 to-green-500 shadow-green-400/30";
      default: // Pending
        return "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 shadow-yellow-400/30";
    }
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-1 sm:h-1.5 overflow-hidden">
      <div
        className={`${getColor()} h-1 sm:h-1.5 rounded-full shadow-md transition-all duration-700`}
        style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default Progress;

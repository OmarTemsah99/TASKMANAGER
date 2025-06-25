interface ProgressProps {
  progress: number;
  status: string;
}

const Progress = ({ progress, status }: ProgressProps) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-400";
      case "Completed":
        return "bg-green-400";
      default: // Pending
        return "bg-yellow-400";
    }
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-1 sm:h-1.5">
      {" "}
      {/* Responsive height */}
      <div
        className={`${getColor()} h-1 sm:h-1.5 rounded-full`}
        style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default Progress;

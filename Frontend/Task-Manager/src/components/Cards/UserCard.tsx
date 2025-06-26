import { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import type { User } from "../../types/user";

interface UserCardProps {
  userInfo: User;
}

const UserCard = ({ userInfo }: UserCardProps) => {
  const [imgError, setImgError] = useState(false);

  const hasValidImage = userInfo.profileImageUrl && !imgError;

  return (
    <div className="card p-4 sm:p-6 rounded-xl shadow-md shadow-black/10">
      <div className="flex items-center gap-4 mb-4">
        {hasValidImage ? (
          <img
            src={userInfo.profileImageUrl}
            onError={() => setImgError(true)}
            alt={`Avatar of ${userInfo?.name}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-purple-500/20 shadow-sm"
          />
        ) : (
          <IoPersonCircle className="w-14 h-14 sm:w-16 sm:h-16 text-gray-500" />
        )}

        <div>
          <p className="text-white font-semibold text-sm sm:text-base leading-tight">
            {userInfo?.name}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {userInfo?.email}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <StatCard
          label="Pending"
          count={userInfo.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

// Reusable Stat Tag
interface StatCardProps {
  label: string;
  count: number;
  status: string;
}

const StatCard = ({ label, count, status }: StatCardProps) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-blue-500/10";
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30 shadow-green-500/10";
      default:
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-yellow-500/10";
    }
  };

  return (
    <div
      className={`text-xs font-medium ${getStatusTagColor()} px-3 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
      <span className="font-semibold">{count}</span>
      <span className="ml-1">{label}</span>
    </div>
  );
};

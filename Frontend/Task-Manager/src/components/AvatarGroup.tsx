import { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

interface AvatarGroupProps {
  avatars: string[];
  maxVisible: number;
}

const AvatarGroup = ({ avatars, maxVisible = 3 }: AvatarGroupProps) => {
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);

  const handleImgError = (index: number) => {
    setErrorIndexes((prev) => [...prev, index]);
  };

  return (
    <div className="flex items-center">
      {avatars
        .slice(0, maxVisible)
        .map((avatar, index) =>
          !avatar || errorIndexes.includes(index) ? (
            <IoPersonCircleOutline
              key={`placeholder-${index}`}
              className="w-9 h-9 text-white -ml-3 first:ml-0 rounded-full border-2 border-[#4C35A0]/50 shadow-lg shadow-blue-500/20 bg-[#1E1145]"
            />
          ) : (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              onError={() => handleImgError(index)}
              className="w-9 h-9 rounded-full border-2 border-[#4C35A0]/50 -ml-3 first:ml-0 shadow-lg shadow-blue-500/20 object-cover"
            />
          )
        )}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#2A1B5D] to-[#3D2A7D] text-sm font-medium text-white rounded-full border-2 border-[#4C35A0]/50 -ml-3 shadow-lg shadow-purple-500/10">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

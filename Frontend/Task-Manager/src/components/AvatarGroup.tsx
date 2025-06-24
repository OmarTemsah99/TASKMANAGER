interface AvatarGroupProps {
  avatars: string[];
  maxVisible: number;
}

const AvatarGroup = ({ avatars, maxVisible = 3 }: AvatarGroupProps) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-[#4C35A0]/50 -ml-3 first:ml-0 shadow-lg shadow-blue-500/20"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#2A1B5D] to-[#3D2A7D] text-sm font-medium text-white rounded-full border-2 border-[#4C35A0]/50 -ml-3 shadow-lg shadow-purple-500/10">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

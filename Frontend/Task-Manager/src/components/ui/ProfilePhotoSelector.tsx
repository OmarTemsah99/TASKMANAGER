import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

interface ProfilePhotoSelectorProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

const ProfilePhotoSelector = ({
  image,
  setImage,
}: ProfilePhotoSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(undefined);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-8">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="relative group">
          <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border-2 border-dashed border-blue-400/50 hover:border-blue-400 transition-all duration-200 cursor-pointer group-hover:bg-gradient-to-br group-hover:from-blue-500/30 group-hover:to-purple-500/30">
            <LuUser className="text-4xl text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center gradient-bg text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg shadow-purple-500/30"
            onClick={onChooseFile}>
            <LuUpload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
            <img
              src={previewUrl}
              alt="profile photo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg"
            onClick={handleRemoveImage}>
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;

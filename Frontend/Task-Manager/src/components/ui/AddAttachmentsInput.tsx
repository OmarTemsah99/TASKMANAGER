import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

interface AddAttachmentsInputProps {
  attachments: string[];
  setAttachments: (value: string[]) => void;
}

const AddAttachmentsInput = ({
  attachments,
  setAttachments,
}: AddAttachmentsInputProps) => {
  const [option, setOption] = useState("");
  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index: number) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item + index}
          className="flex justify-between items-center bg-white/10 border border-white/10 px-2 py-1 rounded-md mb-2">
          <div className="flex-1 flex items-center gap-2">
            <LuPaperclip className="text-gray-300 text-base" />
            <p className="text-xs text-white truncate">{item}</p>
          </div>

          <button
            className="cursor-pointer p-1 hover:bg-red-50/10 rounded"
            onClick={() => handleDeleteOption(index)}
            aria-label="Delete attachment">
            <HiOutlineTrash className="text-base text-red-400" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 flex items-center form-input gap-2 px-2">
          <LuPaperclip className="text-gray-300 text-base" />

          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-xs text-white outline-none bg-transparent py-2 placeholder:text-gray-300"
          />
        </div>

        <button
          className="card-btn px-3 py-2 text-xs flex gap-1 items-center"
          onClick={handleAddOption}>
          <HiMiniPlus className="text-base" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;

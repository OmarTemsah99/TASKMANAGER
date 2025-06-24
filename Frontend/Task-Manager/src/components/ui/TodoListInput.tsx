import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

interface TodoListInputProps {
  todoList: string[];
  setTodoList: (value: string[]) => void;
}

const TodoListInput = ({ todoList, setTodoList }: TodoListInputProps) => {
  const [option, setOption] = useState("");
  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index: number) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={item + index}
          className="flex justify-between items-center bg-white/10 border border-white/10 px-2 py-1 rounded-md mb-2">
          <p className="text-xs text-white truncate">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="cursor-pointer p-1 hover:bg-red-50/10 rounded"
            onClick={() => handleDeleteOption(index)}
            aria-label="Delete task">
            <HiOutlineTrash className="text-base text-red-400" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="form-input py-2 text-xs bg-white/5 border-white/10 text-white placeholder:text-gray-300"
        />

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

export default TodoListInput;

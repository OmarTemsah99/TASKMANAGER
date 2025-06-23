import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

interface SelectDropdownOption {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  options: SelectDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex justify-between items-center cursor-pointer !text-white !bg-[#2A1B5D]/80 !border-[#3D2A7D] focus:border-[#4C35A0] focus:ring-2 focus:ring-[#4C35A0]/30 hover:border-[#4C35A0]/60 hover:bg-[#2A1B5D] transition-all duration-300">
        <span>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <span
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}>
          <LuChevronDown />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-[#2A1B5D]/90 border border-[#3D2A7D] rounded-lg mt-1 shadow-xl z-20 backdrop-blur-sm">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 text-sm text-white cursor-pointer hover:bg-[#4C35A0]/30 transition-colors duration-150 ${
                option.value === value ? "bg-[#3D2A7D]/60" : ""
              }`}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;

import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "placeholder"
  > {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      className = "",
      type,
      value,
      onChange,
      placeholder,
      error,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="mb-4">
        <label
          className={`input-label ${
            isFocused || value ? "text-blue-400" : ""
          }`}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`input-base ${isPassword ? "input-password" : ""} ${
              error ? "border-red-500 focus:border-red-500" : ""
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-toggle-button">
              {showPassword ? (
                <HiEyeOff className="w-5 h-5 transition-colors duration-200" />
              ) : (
                <HiEye className="w-5 h-5 transition-colors duration-200" />
              )}
            </button>
          )}
        </div>
        {error && <p className="auth-error mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

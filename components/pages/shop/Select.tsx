import { useState } from "react";

type SelectProps = {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({ options, defaultValue, onChange }) => {
  const [selected, setSelected] = useState<string>(defaultValue || options[0]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (onChange) onChange(e.target.value);
  };
  return (
    <div className="relative inline-block text-left w-48">
      <select
        value={selected}
        onChange={handleChange}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option} className="p-2">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

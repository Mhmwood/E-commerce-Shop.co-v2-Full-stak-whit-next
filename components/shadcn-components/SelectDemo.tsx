import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

export function SelectDemo({
  options,
  placeholder = "Select an option",
  onChange,
}: {
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className=" text-primary font-bold  border-0  outline-none focus:border-0 focus:outline-none  p-0">
        <SelectValue className="" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectDemo;  

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust path based on your setup

const CustomToggleGroup = ({array}: {array: string[]}) => {
  const [activeButton, setActiveButton] = useState("Marketplace");

  return (
    <div className="flex flex-wrap gap-2">
      {array.map((label) => (
        <Button
          key={label}
          onClick={() => setActiveButton(label)}
          className={`px-4 py-2 rounded-none transition-colors ${
            activeButton === label
              ? "bg-white text-black"
              : "bg-[#2a2a2a] text-white hover:bg-gray-700"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default CustomToggleGroup;
import React from "react";
import { Avatar } from "@/components";

const ChannelCard = ({ logo, name, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 shrink-0 px-4 py-2 rounded-xl border transition
        ${isActive ? "border-blue-500 bg-blue-500/10" : "border-gray-200 bg-white"}
        hover:border-blue-400 hover:bg-blue-50
      `}
    >
      <Avatar src={logo} name={name} size="sm" />
      <span
        className={`text-sm font-medium line-clamp-1 ${
          isActive ? "text-blue-600" : "text-gray-800"
        }`}
      >
        {name}
      </span>
    </button>
  );
};

export default ChannelCard;

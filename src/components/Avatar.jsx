import React from "react";

const Avatar = ({ src, name = "", size = "md", className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const sizeClass =
    size === "sm"
      ? "w-10 h-10 text-sm"
      : size === "lg"
      ? "w-16 h-16 text-xl"
      : "w-12 h-12 text-base";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold overflow-hidden ${sizeClass} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;

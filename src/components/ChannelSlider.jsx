import React from "react";
import { ChannelCard } from "@/components";

const ChannelSlider = ({ channels, selectedChannelId, onSelectChannel }) => {
  if (!channels || channels.length === 0) return (
    <div className='mt-[64px] w-full rounded-sm font-bold text-2xl'>
        Nothing to show
    </div>
  );

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Channels
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {channels.map((ch) => (
              <ChannelCard
                key={ch.id}
                logo={ch.avatar}
                name={ch.name}
                isActive={selectedChannelId === ch.id}
                onClick={() => onSelectChannel(ch)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSlider;

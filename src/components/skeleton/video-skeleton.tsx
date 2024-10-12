import React from 'react';

const TripSkeleton: React.FC = () => (
  <div className="animate-shimmer text-transparent w-max bg-[#000] bg-gradient-to-r from-[#000] via-white to-[#000] bg-[length:125px_100%] bg-clip-text bg-no-repeat pr-[120px] text-center text-5xl">
    <div className="h-[90%] animate-pulse cursor-pointer overflow-hidden rounded-md bg-[#efefefb7]" />
  </div>
);

export default React.memo(TripSkeleton);

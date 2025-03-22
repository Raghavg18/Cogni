import React from "react";
import { StarIcon, StarOutlineIcon } from "@/components/icons";

interface RatingBarProps {
  rating: number;
  percentage: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ rating, percentage }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 text-sm leading-[21px] text-[#0D141C]">{rating}</div>
      <div className="flex-1 h-2 rounded bg-[#E9DCFF]">
        <div
          className="h-full rounded bg-[#7925FF]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-10 text-right text-sm leading-[21px] text-[#0D141C]">
        {percentage}%
      </div>
    </div>
  );
};

interface RatingStatsProps {
  overallRating: number;
  reviewCount: number;
  ratingDistribution: {
    rating: number;
    percentage: number;
  }[];
}

const RatingStats: React.FC<RatingStatsProps> = ({
  overallRating,
  reviewCount,
  ratingDistribution,
}) => {
  // Calculate how many full stars to show
  const fullStars = Math.floor(overallRating);
  // Determine if we need a half star
  const hasHalfStar = overallRating - fullStars >= 0.5;
  // Calculate empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="p-4">
      <div className="text-lg font-bold leading-[23px] text-[#0D141C] pt-0 pb-2 px-0">
        Your Rating
      </div>
      <div className="flex gap-8 p-4 max-sm:flex-col">
        <div className="flex flex-col gap-2">
          <div className="text-4xl font-black leading-[45px] tracking-[-1px] text-[#0D141C]">
            {overallRating.toFixed(1)}
          </div>
          <div className="flex gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
              <div key={`full-star-${i}`} className="text-[#7925FF]">
                <StarIcon />
              </div>
            ))}
            {[...Array(emptyStars)].map((_, i) => (
              <div key={`empty-star-${i}`} className="text-[#7925FF]">
                <StarOutlineIcon />
              </div>
            ))}
          </div>
          <div className="text-base leading-6 text-[#0D141C]">
            {reviewCount} reviews
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-[200px] max-w-[400px] max-sm:max-w-none">
          {ratingDistribution.map((item) => (
            <RatingBar
              key={`rating-${item.rating}`}
              rating={item.rating}
              percentage={item.percentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingStats;

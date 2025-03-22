import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  animationOrder?: number;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  change = 0,
  animationOrder = 0,
  className,
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div
      className={cn("dashboard-card", className)}
      style={{ "--animation-order": animationOrder } as React.CSSProperties}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="stat-label">{title}</h3>
        <div className="text-white/80">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {change !== 0 && (
        <div
          className={`mt-2 ${
            isPositive ? "stat-indicator-up" : "stat-indicator-down"
          }`}
        >
          {isPositive ? (
            <ArrowUp size={16} className="mr-1" />
          ) : (
            <ArrowDown size={16} className="mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

export default StatCard;

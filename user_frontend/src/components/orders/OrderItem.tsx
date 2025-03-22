import React from "react";

interface OrderItemProps {
  image: string;
  title: string;
  category: string;
  status: "In progress" | "Completed";
  progress: string;
}

const OrderItem: React.FC<OrderItemProps> = ({
  image,
  title,
  category,
  status,
  progress,
}) => {
  return (
    <div className="order-item flex min-h-[72px] justify-between items-center bg-[#F7FAFC] px-4 py-2 max-sm:flex-col max-sm:items-start max-sm:gap-3">
      <div className="order-info flex items-center gap-4">
        <img
          src={image}
          alt="Project thumbnail"
          className="w-14 h-14 rounded-lg"
        />
        <div className="order-details flex flex-col gap-1">
          <div className="order-title text-base leading-6 text-[#0D141C]">
            {title}
          </div>
          <div className="order-subtitle text-sm leading-[21px] text-[#4F7396]">
            {category} • {status}
          </div>
        </div>
      </div>
      <div className="order-progress text-base leading-6 text-[#0D141C] max-sm:self-end">
        {progress}
      </div>
    </div>
  );
};

export default OrderItem;

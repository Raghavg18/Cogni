import React from "react";
import OrderItem from "./OrderItem";

interface OrdersListProps {
  title: string;
  orders: {
    id: string;
    image: string;
    title: string;
    category: string;
    status: "In progress" | "Completed";
    progress: string;
  }[];
}

const OrdersList: React.FC<OrdersListProps> = ({ title, orders }) => {
  return (
    <section>
      <h2 className="text-[22px] font-bold leading-7 text-[#0D141C] pt-5 pb-3 px-4 max-sm:text-xl max-sm:leading-[26px]">
        {title}
      </h2>
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          image={order.image}
          title={order.title}
          category={order.category}
          status={order.status}
          progress={order.progress}
        />
      ))}
    </section>
  );
};

export default OrdersList;

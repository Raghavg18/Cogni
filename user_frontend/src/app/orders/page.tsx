import React from "react";
import OrdersList from "@/components/orders/OrdersList";
import RatingStats from "@/components/ratings/RatingStats";

const Index: React.FC = () => {
  // Sample data for in-progress orders
  const inProgressOrders = [
    {
      id: "1",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7ddb70d9d82138571199e0954272c4f7e6cf9e29", // This will be replaced with actual image URL
      title: "Create a landing page for a new product",
      category: "Website Design",
      status: "In progress" as const,
      progress: "3 / 5",
    },
    {
      id: "2",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8e939e598d3ff534bfec05e79c4bebae4c96862c", // This will be replaced with actual image URL
      title: "Create a set of icons for a mobile app",
      category: "Illustration",
      status: "In progress" as const,
      progress: "1 / 4",
    },
  ];

  // Sample data for delivered orders
  const deliveredOrders = [
    {
      id: "3",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/53d418759212022ca67a91a318908676b3bec8f6", // This will be replaced with actual image URL
      title: "Design a logo for a new company",
      category: "Logo design",
      status: "Completed" as const,
      progress: "5 / 5",
    },
    {
      id: "4",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/dc54f38a6e9301f77621ec13460db444334cfdea", // This will be replaced with actual image URL
      title: "Create a landing page for a new product",
      category: "Website Design",
      status: "Completed" as const,
      progress: "5 / 5",
    },
    {
      id: "5",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/b2323008d69ba82fb68df28a9e1fc82885b268bc", // This will be replaced with actual image URL
      title: "Create a set of icons for a mobile app",
      category: "Illustration",
      status: "Completed" as const,
      progress: "4.5 / 5",
    },
  ];

  // Rating distribution data
  const ratingDistribution = [
    { rating: 5, percentage: 75 },
    { rating: 4, percentage: 10 },
    { rating: 3, percentage: 3 },
    { rating: 2, percentage: 7 },
    { rating: 1, percentage: 5 },
  ];

  return (
    <div className="max-w-[960px] mx-auto">
      <link
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
      <div className="flex min-h-screen max-md:flex-col">
        <main className="flex-1  p-4 max-md:p-3">
          <header>
            <h1 className="text-4xl font-black leading-[45px] tracking-[-1px] text-[#0D141C] mb-5 p-4 max-sm:text-[28px] max-sm:leading-9 max-sm:p-3">
              Your Orders
            </h1>
          </header>

          <OrdersList title="In Progress" orders={inProgressOrders} />
          <OrdersList title="Delivered" orders={deliveredOrders} />

          <RatingStats
            overallRating={4.8}
            reviewCount={25}
            ratingDistribution={ratingDistribution}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;

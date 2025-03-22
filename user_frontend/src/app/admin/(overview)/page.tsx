import { DollarSign, BarChart3, Users, Briefcase } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-dashboard-dark bg-white">
      <div className="flex-1 p-8 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold  text-gray-800 mb-2 animate-fade-in">
            Overview
          </h1>
          <p className="text-gray-500 animate-slide-in">
            Welcome to your dashboard, here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Escrow Balance"
            value="$45,231"
            icon={<DollarSign className="text-gray-700 w-8 h-8" />}
            change={12.5}
            animationOrder={0}
            className="bg-white p-6 rounded-lg shadow-lg"
          />
          <StatCard
            title="Sales"
            value="$28,391"
            icon={<BarChart3 className="text-gray-700 w-8 h-8" />}
            change={-8.1}
            animationOrder={1}
            className="bg-white p-6 rounded-lg shadow-lg"
          />
          <StatCard
            title="Freelancers"
            value="1,205"
            icon={<Users className="text-gray-700 w-8 h-8" />}
            change={23.4}
            animationOrder={2}
            className="bg-white p-6 rounded-lg shadow-lg"
          />
          <StatCard
            title="Employers"
            value="845"
            icon={<Briefcase className="text-gray-700 w-8 h-8" />}
            change={15.7}
            animationOrder={2}
            className="bg-white p-6 rounded-lg shadow-lg"
          />
        </div>

        <SalesChart />
      </div>
    </div>
  );
};

export default Index;

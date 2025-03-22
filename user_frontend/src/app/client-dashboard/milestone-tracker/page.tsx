interface orders {
  freelancer: string;
  title: string;
  completed: number;
  amount: number;
}

const Page = () => {
  const orders: orders[] = [
    {
      freelancer: "Samantha - Product Designer",
      title: "Full Stack Project",
      completed: 20,
      amount: 3000,
    },
    {
      freelancer: "Michael - Software Engineer",
      title: "Mobile App Development",
      completed: 50,
      amount: 5000,
    },
    {
      freelancer: "Emma - Data Scientist",
      title: "Machine Learning Model",
      completed: 75,
      amount: 7000,
    },
  ];

  // Helper function to get progress bar color
  const getProgressColor = (completed: number) => {
    if (completed < 30) return 'bg-[#ffeca0]';
    if (completed < 70) return 'bg-[#bde1ff]';
    return 'bg-[#beffbe]';
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10 mb-3">
            Milestone Tracker
          </h1>
          <p className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296] text-lg max-w-2xl">
            View the completion rate of your projects, check the ratings of
            freelancers, and monitor your ongoing projects
          </p>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl border border-[#e5e8ea] shadow-sm">
          <div className="p-6 border-b border-[#e5e8ea]">
            <h2 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-xl">
              Active Projects ({orders.length})
            </h2>
          </div>

          <div className="divide-y divide-[#e5e8ea]">
            {orders.map((order) => (
              <div 
                key={order.title} 
                className="p-6 hover:bg-[#f7f9fc] transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-lg mb-2">
                      {order.freelancer}
                    </h3>
                    <p className="text-[#4f7296] mb-4">
                      Working on <span className="font-medium text-[#0c141c]">{order.title}</span>
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[#f1f3f5] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(order.completed)} transition-all duration-500 ease-out`}
                          style={{ width: `${order.completed}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#4f7296] whitespace-nowrap">
                        {order.completed}% Complete
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-xl">
                        ${order.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#4f7296]">Project Value</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

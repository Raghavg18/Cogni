"use client";
import { BellIcon, SearchIcon } from "lucide-react";
import React, { useState, useEffect, JSX } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

const Milestone = (): JSX.Element => {
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectId = "67dd5d96b49b221b7dfc7e4a"; 
  const navItems = ["Home", "Dashboard", "Jobs", "Reports", "Messages"];
  const calculateProgress = () => {
    if (!milestones || milestones.length === 0) return 0;
    
    const completedMilestones = milestones.filter(m => m.status === "paid").length;
    return Math.round((completedMilestones / milestones.length) * 100);
  };
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const projectResponse = await fetch(`http://localhost:8000/project/${projectId}`, {
          credentials: 'include'
        });
        
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project data');
        }
        
        const projectData = await projectResponse.json();
        setProject(projectData);
        
        // Fetch milestones
        const milestonesResponse = await fetch(`http://localhost:8000/project/${projectId}/milestones`, {
          credentials: 'include'
        });
        
        if (!milestonesResponse.ok) {
          throw new Error('Failed to fetch milestones');
        }
        
        const milestonesData = await milestonesResponse.json();
        setMilestones(milestonesData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // Release payment for a milestone
  const handleReleasePayment = async (milestoneId: any) => {
    try {
      const response = await fetch('http://localhost:8000/release-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ milestoneId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update milestone status locally
        setMilestones(milestones.map(m => 
          m._id === milestoneId ? { ...m, status: "paid" } : m
        ));
        
        console.log("Payment released successfully");
      } else {
        console.error("Failed to release payment:", data.message);
      }
    } catch (err) {
      console.error("Error releasing payment:", err);
    }
  };

  // Calculate budget data based on milestones
  const getBudgetData = () => {
    if (!milestones || milestones.length === 0) {
      return [
        { title: "Total Budget", amount: "$0", color: "text-[#0d141c]" },
        { title: "Released", amount: "$0", color: "text-[#34b233]" },
        { title: "Remaining", amount: "$0", color: "text-[#696969]" },
      ];
    }

    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    const releasedAmount = milestones
      .filter(m => m.status === "paid")
      .reduce((sum, m) => sum + m.amount, 0);
    const remainingAmount = totalAmount - releasedAmount;

    return [
      { title: "Total Budget", amount: `$${totalAmount.toLocaleString()}`, color: "text-[#0d141c]" },
      { title: "Released", amount: `$${releasedAmount.toLocaleString()}`, color: "text-[#34b233]" },
      { title: "Remaining", amount: `$${remainingAmount.toLocaleString()}`, color: "text-[#696969]" },
    ];
  };

  // Generate timeline data from milestones
  const getTimelineData = () => {
    if (!milestones || milestones.length === 0) {
      return [];
    }

    // Create a timeline with default stages
    const timeline = [
      { title: "Job started", date: "Jun 1, 2023", status: "completed" },
      ...milestones.map((milestone, index) => {
        let status = "upcoming";
        if (milestone.status === "paid") {
          status = "completed";
        } else if (milestone.status === "submitted") {
          status = "pending";
        }
        
        // For demo purposes, generate dates relative to job start
        const date = new Date(2023, 5, 1); // June 1, 2023
        date.setDate(date.getDate() + (index + 1) * 15); // Add 15 days per milestone
        
        return {
          title: milestone.description,
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status
        };
      }),
      { title: "Testing", date: "August 10, 2023", status: "upcoming" }
    ];
    
    return timeline;
  };

  // Generate milestone cards from milestone data
  const getMilestoneCards = () => {
    if (!milestones || milestones.length === 0) {
      return [];
    }

    return milestones
      .filter(m => m.status !== "paid")
      .slice(0, 2) // For the UI, just show a couple
      .map((milestone, index) => {
        let status = "Review";
        let statusColor = "bg-[#f2ecff]";
        let iconBg = "bg-[#fff5be]";
        
        if (milestone.status === "submitted") {
          status = "Release";
          statusColor = "bg-[#ffeca0]";
        } else if (milestone.status === "pending") {
          status = "Pending";
          statusColor = "bg-[#f2ecff]";
          iconBg = milestone.status === "submitted" ? "bg-[#beffbe]" : "bg-[#fff5be]";
        }
        
        // For demo, generate a date 3 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
        
        return {
          id: milestone._id,
          title: `Milestone ${index + 1}: ${milestone.description}`,
          description: milestone.status === "paid" 
            ? `Payment was Settled on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            : `Review and release the payment before ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          status,
          statusColor,
          iconBg,
          milestoneData: milestone
        };
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading project data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  const progress = calculateProgress();
  const budgetData = getBudgetData();
  const timelineData = getTimelineData();
  const milestoneData = getMilestoneCards();

  return (
    <div className="flex flex-col items-start relative bg-white">
      <div className="flex flex-col min-h-[800px] items-start relative self-stretch w-full flex-[0_0_auto] bg-[#f7f9fc]">
        <header className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
          <nav className="items-center justify-between px-10 py-3 flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#e5e8ea] flex relative self-stretch w-full">
            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
              <h1 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-lg tracking-[0] leading-[23px]">
                Acme Co
              </h1>
            </div>

            <div className="justify-end flex items-start gap-8 relative flex-1 grow">
              <div className="inline-flex h-10 items-center gap-9 relative flex-[0_0_auto]">
                {navItems.map((item, index) => (
                  <Button key={index} variant="ghost" className="h-10 px-0">
                    <span className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-sm tracking-[0] leading-[21px]">
                      {item}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-[#e8edf2] rounded-xl"
                >
                  <BellIcon className="h-5 w-5 text-[#0c141c]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-[#e8edf2] rounded-xl"
                >
                  <SearchIcon className="h-5 w-5 text-[#0c141c]" />
                </Button>
              </div>

              <div className="relative w-10 h-10 rounded-[20px] overflow-hidden">
                <img
                  src="/api/placeholder/100/100"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </nav>

          <main className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
            <div className="flex-col max-w-[960px] flex items-start gap-8 relative flex-1 grow">
              {/* Breadcrumb and Status */}
              <div className="relative w-full">
                <div className="flex flex-wrap w-full items-start justify-between gap-[8px_8px] p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
                      Home
                    </span>
                    <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
                      /
                    </span>
                    <span className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-base">
                      All Jobs
                    </span>
                  </div>

                  <Badge className="bg-[#ffeca0] text-[#0c141c] rounded-[10px] font-medium">
                    {milestones.some(m => m.status === "submitted") 
                      ? "Milestone Review Pending" 
                      : "In Progress"}
                  </Badge>
                </div>

                {/* Project Title and Progress */}
                <div className="w-full">
                  <div className="flex flex-wrap w-full items-start p-4">
                    <h2 className="w-full [font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10">
                      {project?.title || "Website Redesign"}
                    </h2>
                  </div>

                  <div className="flex flex-col w-full items-start gap-3 p-4">
                    <div className="justify-between self-stretch w-full flex items-center">
                      <span className="text-[#0c141c] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
                        Progress
                      </span>
                      <span className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#0c141c] text-sm">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#f2ecff] rounded">
                      <Progress
                        value={progress}
                        className="h-2 bg-[#7825ff] rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Cards */}
              <div className="flex gap-[37px] self-stretch w-full">
                {budgetData.map((item, index) => (
                  <Card
                    key={index}
                    className="flex-1 h-[91px] overflow-hidden bg-white rounded-2xl"
                  >
                    <CardContent className="p-0">
                      <div className="p-[22px]">
                        <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0d141c] text-lg leading-6">
                          {item.title}
                        </h3>
                        <p
                          className={`${item.color} [font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[26px] leading-6 mt-4`}
                        >
                          {item.amount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Milestones Timeline */}
              <div className="relative w-full">
                <div className="flex flex-col w-full items-start pt-4 pb-2 px-4">
                  <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-lg leading-[23px]">
                    Milestones Timeline
                  </h3>
                </div>

                <div className="flex flex-col w-full items-start gap-2 px-4 py-0">
                  {timelineData.map((item, index) => {
                    // Determine the status color
                    let dotColor = "bg-[#7825ff]";
                    let lineColor = "bg-[#f2ecff]";

                    if (item.status === "completed") {
                      dotColor = "bg-[#34b233]";
                      lineColor = "bg-[#34b233]";
                    } else if (item.status === "pending") {
                      dotColor = "bg-[#ffcc00]";
                      lineColor = "bg-[#ffcc00]";
                    }

                    const isLast = index === timelineData.length - 1;

                    return (
                      <div
                        key={index}
                        className="flex h-[66.67px] items-start gap-2 relative self-stretch w-full"
                      >
                        <div className="flex flex-col w-10 items-center gap-1 relative self-stretch">
                          {index !== 0 && (
                            <div
                              className={`relative w-0.5 h-4 ${lineColor}`}
                            />
                          )}
                          <div
                            className={`relative w-2 h-2 ${dotColor} rounded`}
                          />
                          {!isLast && (
                            <div
                              className={`relative w-0.5 h-10 ${
                                index === 0 ? "mb-[-5.33px]" : ""
                              } ${lineColor}`}
                            />
                          )}
                        </div>

                        <div className="items-start px-0 py-3 self-stretch flex flex-col relative flex-1 grow">
                          <h4 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-base leading-6">
                            {item.title}
                          </h4>
                          <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#4f7296] text-base leading-6 mb-[-5.33px]">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestone Cards */}
              <Card className="w-full bg-white rounded-2xl">
                <CardContent className="p-0">
                  {milestoneData.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex w-full h-[72px] items-center justify-between px-4 py-2"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex w-12 h-12 items-center justify-center ${milestone.iconBg} rounded-lg`}
                        >
                          <div className="relative w-6 h-6 bg-[url(/api/placeholder/24/24)] bg-[100%_100%]" />
                        </div>

                        <div className="flex flex-col justify-center">
                          <h4 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-base leading-6">
                            {milestone.title}
                          </h4>
                          <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#4f7296] text-sm leading-[21px]">
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          className="h-5 p-0 [font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#7825ff] text-xs underline"
                          onClick={() => {
                            // View milestone details functionality would go here
                            console.log("View details for milestone:", milestone.id);
                          }}
                        >
                          View Details
                        </Button>
                        {milestone.status === "Release" ? (
                          <Button
                            onClick={() => handleReleasePayment(milestone.id)}
                            className="bg-[#7825ff] text-white rounded-[10px] font-medium"
                          >
                            {milestone.status}
                          </Button>
                        ) : (
                          <Badge
                            className={`${milestone.statusColor} text-[#0c141c] rounded-[10px] font-medium`}
                          >
                            {milestone.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </header>
      </div>
    </div>
  );
};

export default Milestone;
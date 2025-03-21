"use client";
import { BellIcon, SearchIcon } from "lucide-react";
import React, { JSX } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

const Milestone = (): JSX.Element => {
  // Navigation items
  const navItems = ["Home", "Dashboard", "Jobs", "Reports", "Messages"];

  // Budget data
  const budgetData = [
    { title: "Total Budget", amount: "$5,000", color: "text-[#0d141c]" },
    { title: "Released", amount: "$2,000", color: "text-[#34b233]" },
    { title: "Remaining", amount: "$3,000", color: "text-[#696969]" },
  ];

  // Timeline data
  const timelineData = [
    { title: "Job started", date: "Jun 1, 2023", status: "completed" },
    { title: "Designing", date: "Jun 15, 2023", status: "completed" },
    { title: "Code Review: 1", date: "July 15, 2023", status: "pending" },
    { title: "Code Review: 2", date: "July 30, 2023", status: "upcoming" },
    { title: "Testing", date: "August 10, 2023", status: "upcoming" },
  ];

  // Milestone data
  const milestoneData = [
    {
      id: 1,
      title: "Milestone 1: Design",
      description: "Payment was Settled on Jun 18, 2023",
      status: "Released",
      statusColor: "bg-[#f2ecff]",
      iconBg: "bg-[#beffbe]",
    },
    {
      id: 2,
      title: "Milestone 2: Code Review: 1",
      description: "Review and release the payment before July 19, 2023",
      status: "Release",
      statusColor: "bg-[#ffeca0]",
      iconBg: "bg-[#fff5be]",
    },
  ];

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
                  src="..//depth-4--frame-2.png"
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
                    Milestone Review Pending
                  </Badge>
                </div>

                {/* Project Title and Progress */}
                <div className="w-full">
                  <div className="flex flex-wrap w-full items-start p-4">
                    <h2 className="w-full [font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10">
                      Website Redesign
                    </h2>
                  </div>

                  <div className="flex flex-col w-full items-start gap-3 p-4">
                    <div className="justify-between self-stretch w-full flex items-center">
                      <span className="text-[#0c141c] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
                        Progress
                      </span>
                      <span className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#0c141c] text-sm">
                        40%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#f2ecff] rounded">
                      <Progress
                        value={40}
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
                  {milestoneData.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex w-full h-[72px] items-center justify-between px-4 py-2"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex w-12 h-12 items-center justify-center ${milestone.iconBg} rounded-lg`}
                        >
                          <div className="relative w-6 h-6 bg-[url(/vector---0.svg)] bg-[100%_100%]" />
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
                        >
                          View Details
                        </Button>
                        <Badge
                          className={`${milestone.statusColor} text-[#0c141c] rounded-[10px] font-medium`}
                        >
                          {milestone.status}
                        </Badge>
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

"use client";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Test data
const testDisputes = [
  {
    id: "1",
    title: "Payment not received for website development",
    description: "Client claims payment was sent but contractor hasn't received the final installment for the e-commerce website development project.",
    status: "pending",
    type: "payment",
    createdAt: "2025-03-20T14:30:00Z",
    amount: 2500,
    clientName: "John Smith",
    contractorName: "Sarah Developer"
  },
  {
    id: "2",
    title: "Incomplete mobile app deliverables",
    description: "Several key features missing from the final delivery. Push notifications and user authentication modules not implemented as per contract.",
    status: "accepted", // Changed from "resolved"
    type: "service",
    createdAt: "2025-03-19T09:15:00Z",
    amount: 5000,
    clientName: "Tech Corp",
    contractorName: "Mobile Apps Pro"
  },
  {
    id: "3",
    title: "Quality issues with UI design",
    description: "Delivered designs do not match the agreed mockups. Color scheme and typography inconsistent with brand guidelines.",
    status: "rejected",
    type: "service",
    createdAt: "2025-03-18T16:45:00Z",
    amount: 1500,
    clientName: "Design Agency",
    contractorName: "UI Masters"
  }
] as const;

export default function DisputesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#ffeca0] text-[#0c141c]";
      case "accepted": // Changed from "resolved"
        return "bg-[#beffbe] text-[#0c141c]";
      case "rejected":
        return "bg-[#ffd4d4] text-[#991b1b]";
      default:
        return "bg-[#f2ecff] text-[#0c141c]";
    }
  };

  const filteredDisputes = testDisputes.filter(dispute => 
    (statusFilter === "all" || dispute.status === statusFilter) &&
    (dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.contractorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#0c141c] mb-1">
              Dispute Management
            </h1>
            <p className="text-[#4f7296] text-base">
              {filteredDisputes.length} active disputes
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296] w-4 h-4" />
              <input
                type="text"
                placeholder="Search disputes..."
                className="w-full md:w-[220px] h-9 pl-9 pr-3 rounded-lg border border-[#e5e8ea] text-sm focus:outline-none focus:ring-2 focus:ring-[#7825ff]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296] w-4 h-4" />
              <select
                className="appearance-none w-[130px] h-9 pl-9 pr-3 rounded-lg border border-[#e5e8ea] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7825ff] cursor-pointer text-[#0c141c]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#4f7296" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Disputes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDisputes.map((dispute) => (
            <Card 
              key={dispute.id}
              className="cursor-pointer hover:shadow-sm transition-all duration-200 border-t-[3px]"
              style={{
                borderTopColor: dispute.status === 'pending' ? '#ffeca0' : 
                               dispute.status === 'accepted' ? '#beffbe' : '#ffd4d4'
              }}
              onClick={() => router.push(`/admin/disputes/${dispute.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[#0c141c] text-base line-clamp-2">
                    {dispute.title}
                  </h3>
                  <Badge className={`text-xs font-medium ${getStatusBadgeStyles(dispute.status)}`}>
                    {dispute.status}
                  </Badge>
                </div>

                <p className="text-[#4f7296] text-sm mb-3 line-clamp-2">
                  {dispute.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4f7296]">Amount</span>
                    <span className="font-medium text-[#0c141c]">${dispute.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4f7296]">Filed By</span>
                    <span className="font-medium text-[#0c141c]">{dispute.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4f7296]">Against</span>
                    <span className="font-medium text-[#0c141c]">{dispute.contractorName}</span>
                  </div>
                  <div className="pt-2 border-t border-[#e5e8ea]">
                    <span className="text-[#4f7296] text-xs">
                      Filed {new Date(dispute.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#4f7296] text-base">No disputes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
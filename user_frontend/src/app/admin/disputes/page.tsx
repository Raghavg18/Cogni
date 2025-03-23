"use client";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = "https://cogni-production.up.railway.app/disputes"; // Change this if deployed

export default function DisputesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch disputes from API
  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_URL}?status=${statusFilter !== "all" ? statusFilter : ""}`
        );
        const data = await response.json();
        setDisputes(data);
      } catch {
        setError("Failed to fetch disputes");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [statusFilter]);

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#ffeca0] text-[#0c141c]";
      case "accepted":
        return "bg-[#beffbe] text-[#0c141c]";
      case "rejected":
        return "bg-[#ffd4d4] text-[#991b1b]";
      default:
        return "bg-[#f2ecff] text-[#0c141c]";
    }
  };

  interface Dispute {
    _id: string;
    disputeTitle: string;
    disputeAmount: number;
    status: string;
  }

  const filteredDisputes = disputes.filter((dispute: Dispute) =>
    dispute.disputeTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="p-8 max-w-[1400px] mx-auto">
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
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-[#4f7296] text-base">
            Loading disputes...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDisputes.map((dispute: Dispute) => (
              <Card
                key={dispute._id}
                className="cursor-pointer hover:shadow-sm transition-all duration-200 border-t-[3px]"
                style={{
                  borderTopColor:
                    dispute.status === "pending"
                      ? "#ffeca0"
                      : dispute.status === "accepted"
                      ? "#beffbe"
                      : "#ffd4d4",
                }}
                onClick={() => router.push(`/admin/disputes/${dispute._id}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-[#0c141c] text-base line-clamp-2">
                      {dispute.disputeTitle}
                    </h3>
                    <Badge
                      className={`text-xs font-medium ${getStatusBadgeStyles(
                        dispute.status
                      )}`}>
                      {dispute.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4f7296]">Amount</span>
                      <span className="font-medium text-[#0c141c]">
                        ${dispute?.disputeAmount?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#4f7296]">Filed By</span>
                      <span className="font-medium text-[#0c141c]">
                        {dispute.disputeTitle}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

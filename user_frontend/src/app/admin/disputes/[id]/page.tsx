"use client";
import { ArrowLeft, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DisputeStatus = "pending" | "resolved" | "rejected";
type DisputeType = "payment" | "service" | "other";

interface LocalDispute {
  id: string;
  title: string;
  status: DisputeStatus;
  type: DisputeType;
  createdAt: string;
  description: string;
  details: {
    amount: string;
    clientName: string;
    contractorName: string;
    timeline: Array<{
      date: string;
      event: string;
    }>;
  };
}

interface DisputePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DisputePage({ params }: DisputePageProps) {
  const router = useRouter();
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'close' | null>(null);

  // Initialize state with proper typing
  const [localDispute, setLocalDispute] = useState<LocalDispute>(() => ({
    id: "",
    title: "Payment not received for Project A",
    status: "pending",
    type: "payment",
    createdAt: "2024-03-21",
    description: "Client claims payment was sent but not received",
    details: {
      amount: "$5,000",
      clientName: "John Doe",
      contractorName: "Jane Smith",
      timeline: [
        { date: "2024-03-21", event: "Dispute opened" },
        { date: "2024-03-22", event: "Client response received" },
      ],
    },
  }));

  // Use useEffect to update the ID once params resolve
  useEffect(() => {
    const updateId = async () => {
      const resolvedParams = await params;
      setLocalDispute(prev => ({ ...prev, id: resolvedParams.id }));
    };
    updateId();
  }, [params]);

  // Now the handleDisputeAction will work with proper typing
  const handleDisputeAction = () => {
    setLocalDispute((prev) => ({
      ...prev,
      status: actionType === 'approve' ? 'resolved' : 'rejected',
    }));
    setIsActionDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="p-6 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#4f7296] hover:text-[#0c141c] hover:bg-[#e8edf2] rounded-xl cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" /> Back to Disputes
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
            Home
          </span>
          <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
            /
          </span>
          <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
            Disputes
          </span>
          <span className="text-[#4f7296] [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-base">
            /
          </span>
          <span className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-base">
            Details
          </span>
        </div>

        <Card className="border border-[#e5e8ea] rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-[#e5e8ea]">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10 mb-2">
                  {localDispute.title}
                </h1>
                <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#4f7296] text-base">
                  Dispute ID: {localDispute.id}
                </p>
              </div>
              <Badge
                className={`rounded-[10px] font-medium ${
                  localDispute.status === "pending"
                    ? "bg-[#ffeca0] text-[#0c141c]"
                    : localDispute.status === "resolved"
                    ? "bg-[#beffbe] text-[#0c141c]"
                    : "bg-[#ffd4d4] text-[#991b1b]"
                }`}
              >
                {localDispute.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Description Section */}
            <div className="mb-8">
              <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-lg mb-3">
                Description
              </h3>
              <p className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296] text-base">
                {localDispute.description}
              </p>
            </div>

            <Separator className="my-6 bg-[#e5e8ea]" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-lg mb-4">
                  Dispute Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-[#4f7296] text-sm mb-1">Type</dt>
                    <dd className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] capitalize">
                      {localDispute.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4f7296] text-sm mb-1">Amount in Dispute</dt>
                    <dd className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c]">
                      {localDispute.details.amount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4f7296] text-sm mb-1">Client</dt>
                    <dd className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c]">
                      {localDispute.details.clientName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4f7296] text-sm mb-1">Contractor</dt>
                    <dd className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c]">
                      {localDispute.details.contractorName}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-lg mb-4">
                  Timeline
                </h3>
                <div className="space-y-4">
                  {localDispute.details.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-24 text-sm text-[#4f7296]">{item.date}</div>
                      <div className="text-[#0c141c]">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {localDispute.status === "pending" && (
              <div className="mt-8 flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionType('close');
                    setIsActionDialogOpen(true);
                  }}
                  className="bg-[#fff1f1] border-[#ffd4d4] text-[#991b1b] hover:bg-[#ffd4d4] hover:text-[#991b1b] rounded-xl cursor-pointer transition-all duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Dispute
                </Button>
                <Button
                  onClick={() => {
                    setActionType('approve');
                    setIsActionDialogOpen(true);
                  }}
                  className="bg-[#7825ff] hover:bg-[#6420cc] text-white rounded-xl cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Resolve Dispute
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent className="bg-white border border-[#e5e8ea] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-lg">
                {actionType === 'approve' ? 'Resolve Dispute' : 'Reject Dispute'}
              </DialogTitle>
              <DialogDescription className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296]">
                Are you sure you want to {actionType === 'approve' ? 'resolve' : 'reject'} this dispute? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setIsActionDialogOpen(false)}
                className="bg-[#f7f9fc] border-[#e5e8ea] text-[#4f7296] hover:bg-[#e8edf2] hover:text-[#0c141c] rounded-xl cursor-pointer transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisputeAction}
                className={`${
                  actionType === 'approve'
                    ? 'bg-[#7825ff] hover:bg-[#6420cc] text-white'
                    : 'bg-[#fff1f1] border-[#ffd4d4] text-[#991b1b] hover:bg-[#ffd4d4]'
                } rounded-xl cursor-pointer transition-colors duration-200`}
              >
                {actionType === 'approve' ? 'Resolve' : 'Reject'} Dispute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
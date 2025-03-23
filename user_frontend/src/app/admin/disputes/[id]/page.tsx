"use client";
import { ArrowLeft, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DisputeData {
  _id: string;
  disputeTitle: string;
  disputeAmount: string;
}

interface DisputePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DisputePage({ params }: DisputePageProps) {
  const router = useRouter();
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "close" | null>(
    null
  );

  // Initialize state with proper typing
  const [localDispute, setLocalDispute] = useState<DisputeData>(() => ({
    disputeTitle: "",
    disputeAmount: "",
    _id: "",
  }));

  // Use useEffect to update the ID once params resolve
  useEffect(() => {
    const updateId = async () => {
      const resolvedParams = await params;
      setLocalDispute((prev) => ({ ...prev, id: resolvedParams.id }));
    };
    updateId();
  }, [params]);

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const resolvedParams = await params;
        console.log("ID: ", resolvedParams);
        const response = await fetch(
          `http://localhost:8000/disputes/${resolvedParams.id}`
        );
        console.log("RESPPNSE:", response);
        if (!response.ok) throw new Error("Failed to fetch dispute");
        const data: DisputeData = await response.json();
        setLocalDispute(data);
      } catch (error) {
        console.error("Error fetching dispute:", error);
      }
    };

    fetchDispute();
  }, [params]);

  const handleDisputeAction = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/disputes/${localDispute._id}/${
          actionType === "approve" ? "resolve" : "reject"
        }`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update dispute status");

      const updatedDispute = await response.json();
      setLocalDispute(updatedDispute.dispute);
      setIsActionDialogOpen(false);
      router.push("/admin/disputes");
    } catch (error) {
      console.error("Error updating dispute:", error);
    }
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

        <Card className="border border-[#e5e8ea] rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-[#e5e8ea]">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10 mb-2">
                  {localDispute.disputeAmount}
                </h1>
                <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-normal text-[#4f7296] text-base">
                  Dispute ID: {localDispute._id}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Description Section */}
            <div className="mb-8">
              <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c] text-lg mb-3">
                Description
              </h3>
              <p className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296] text-base">
                {localDispute.disputeTitle}
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
                    <dt className="text-[#4f7296] text-sm mb-1">
                      Amount in Dispute
                    </dt>
                    <dd className="[font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-[#0c141c]">
                      {localDispute.disputeAmount}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setActionType("close");
                  setIsActionDialogOpen(true);
                }}
                className="bg-[#fff1f1] border-[#ffd4d4] text-[#991b1b] hover:bg-[#ffd4d4] hover:text-[#991b1b] rounded-xl cursor-pointer transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Dispute
              </Button>
              <Button
                onClick={() => {
                  setActionType("approve");
                  setIsActionDialogOpen(true);
                }}
                className="bg-[#7825ff] hover:bg-[#6420cc] text-white rounded-xl cursor-pointer"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Dispute
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent className="bg-white border border-[#e5e8ea] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-lg">
                {actionType === "approve" ? "Accept Dispute" : "Reject Dispute"}
              </DialogTitle>
              <DialogDescription className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296]">
                Are you sure you want to{" "}
                {actionType === "approve" ? "accept" : "reject"} this dispute?
                This action cannot be undone.
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
                  actionType === "approve"
                    ? "bg-[#7825ff] hover:bg-[#6420cc] text-white"
                    : "bg-[#fff1f1] border-[#ffd4d4] text-[#991b1b] hover:bg-[#ffd4d4]"
                } rounded-xl cursor-pointer transition-colors duration-200`}
              >
                {actionType === "approve" ? "Accept" : "Reject"} Dispute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

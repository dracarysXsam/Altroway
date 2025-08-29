"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { saveJob, unsaveJob, checkIfJobSaved } from "@/app/actions/job-actions";

interface SaveJobButtonProps {
  jobId: string;
  variant?: "default" | "outline" | "ghost";
}

export function SaveJobButton({ jobId, variant = "default" }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const { isSaved } = await checkIfJobSaved(jobId);
        setIsSaved(isSaved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedStatus();
  }, [jobId]);

  const handleToggleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        const result = await unsaveJob(jobId);
        if (result.status === "success") {
          setIsSaved(false);
        } else {
          alert(result.message || "Failed to remove job from saved jobs");
        }
      } else {
        const result = await saveJob(jobId);
        if (result.status === "success") {
          setIsSaved(true);
        } else {
          alert(result.message || "Failed to save job");
        }
      }
    } catch (error) {
      console.error("Error toggling job save:", error);
      alert("Failed to update saved jobs");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant={variant} disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`${
        isSaved 
          ? "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100" 
          : ""
      }`}
    >
      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save Job"}
    </Button>
  );
}

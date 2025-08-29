"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormState, useFormStatus } from "react-dom";
import { applyToJob } from "@/app/actions/job-actions";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";

interface JobApplicationFormProps {
  jobId: string;
}

const initialState = {
  message: "",
  status: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Submitting Application...
        </>
      ) : (
        "Submit Application"
      )}
    </Button>
  );
}

export function JobApplicationForm({ jobId }: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [state, dispatch] = useFormState(applyToJob, initialState);

  const handleSubmit = async (formData: FormData) => {
    // Create a new FormData object with the correct structure
    const newFormData = new FormData();
    newFormData.append("jobId", jobId);
    newFormData.append("coverLetter", coverLetter);
    
    if (resumeFile) {
      newFormData.append("resumeFile", resumeFile);
    }

    dispatch(newFormData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, Word document, or text file");
        return;
      }
      
      setResumeFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.status === "success" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="coverLetter" className="text-sm font-medium">
            Cover Letter *
          </Label>
          <Textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
            className="min-h-[120px] mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Explain your interest in the role and relevant experience
          </p>
        </div>

        <div>
          <Label htmlFor="resume" className="text-sm font-medium">
            Resume/CV (Optional)
          </Label>
          <div className="mt-1">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, Word documents, or text files (max 5MB)
            </p>
            {resumeFile && (
              <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                <FileText className="h-4 w-4" />
                <span>{resumeFile.name}</span>
              </div>
            )}
          </div>
        </div>

        <SubmitButton />
      </form>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Your application will be sent directly to the employer</p>
        <p>• You can track your application status in your dashboard</p>
        <p>• The employer may contact you through the messaging system</p>
      </div>
    </div>
  );
}

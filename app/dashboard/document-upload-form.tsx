"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadDocument } from "@/app/actions/document-actions";

const initialState = {
  message: "",
  status: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : "Upload Document"}
    </Button>
  );
}

export function DocumentUploadForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [state, dispatch] = useFormState(uploadDocument, initialState);

  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Upload a New Document</CardTitle>
          <CardDescription>Select a file from your device to upload to your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="document">Document</Label>
            <Input id="document" name="document" type="file" required />
          </div>
          {state.status === "error" && (
            <p className="text-sm font-medium text-destructive mt-2">{state.message}</p>
          )}
           {state.status === "success" && (
            <p className="text-sm font-medium text-green-600 mt-2">{state.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

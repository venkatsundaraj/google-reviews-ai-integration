"use client";
import { api } from "@/trpc/react";
import { createContext, useCallback, useContext, useMemo } from "react";

type AttachmentManager = {
  addAttachment: (file: File[]) => void;
};
export const AttachmentsContext = createContext<AttachmentManager | null>(null);

export const AttachmentProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mutateAsync: uploadFiles } = api.file.upload.useMutation({});
  const addAttachment = useCallback((file: File[]) => {
    console.log(file);
    // uploadFiles({ file });
  }, []);
  const value = useMemo(() => ({ addAttachment }), []);
  return (
    <AttachmentsContext.Provider value={value ?? null}>
      {children}
    </AttachmentsContext.Provider>
  );
};

export const useAttachment = function () {
  const context = useContext(AttachmentsContext);
  if (!context) {
    throw new Error("Please wrap the entire application");
  }
  return context;
};

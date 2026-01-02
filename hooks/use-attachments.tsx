"use client";
import { fileToBase64 } from "@/lib/utils";
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
  const addAttachment = useCallback(async (file: File[]) => {
    const filesWithData = await Promise.all(
      file.map(async (item) => ({
        name: item.name,
        type: item.type,
        data: await fileToBase64(item),
        size: item.size,
      }))
    );
    uploadFiles({ files: filesWithData });
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

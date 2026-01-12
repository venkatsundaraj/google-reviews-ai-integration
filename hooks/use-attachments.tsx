"use client";
import { fileToBase64, getFileType } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AttachmentSchema } from "@/lib/validation/chat";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { nanoid } from "nanoid";
import { toast } from "sonner";

export type LocalAttachment = {
  variant: "chat";
  id: string;
  localUrl?: string;
  type: "image" | "pdf" | "docx" | "txt" | "video";
  title: string;
  uploadProgress: number;
  isUploadDone: boolean;
};
type AttachmentManager = {
  addAttachment: (file: File[]) => void;
  attachments: LocalAttachment[];
};
export const AttachmentsContext = createContext<AttachmentManager | null>(null);

export const AttachmentProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [uploadingFields, setUploadingFields] = useState<Map<string, string>>(
    new Map()
  );
  const { mutateAsync: uploadFiles } = api.file.upload.useMutation({});

  // useEffect(() => {
  //   console.log(attachments);
  // }, [attachments]);

  const { startUpload, isUploading } = useUploadThing("chatAttachment", {
    onUploadProgress: (uploadProgress) => {
      console.log(uploadProgress, "progress");
      setAttachments((prev) => {
        return prev.map((file) => {
          if ("uploadProgress" in file && file.uploadProgress) {
            return { ...file, uploadProgress: uploadProgress };
          }
          return file;
        });
      });
    },
    onClientUploadComplete: (files) => {
      if (!files.length) return;

      files.forEach((file) => {
        const fileType = getFileType(file.name, file.type);
        const localId = uploadingFields.get(file.name);

        setAttachments((prev) => {
          return prev.map((item) => {
            if (
              ("uploadProgress" in item && item.id === localId) ||
              ("uploadProgress" in item && item.title === file.name)
            ) {
              return {
                uploadProgress: 100,
                id: item.id,
                title: item.title,
                type: fileType,
                variant: "chat",
                url: file.ufsUrl,
                key: file.key,
                isUploadDone: true,
              } as LocalAttachment;
            }

            return item;
          });
        });

        setUploadingFields(new Map());

        toast.success(
          files.length === 1
            ? "Upload complete!"
            : `${files.length} files uploaded successfully!`
        );
      });
    },
    onUploadError: () => {},
  });

  const addAttachment = useCallback(async (files: File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];

    if (!fileArray.length) return;

    const newFileIds = new Map<string, string>();

    const newLocalAttachments = fileArray.map((item) => {
      const id = nanoid();
      const fileType = getFileType(item.name, item.type);
      let localUrl: string | undefined = undefined;

      if (fileType.startsWith("image/")) {
        localUrl = URL.createObjectURL(item);
      }

      newFileIds.set(item.name, id);

      return {
        localUrl,
        id,
        uploadProgress: 0,
        title: item.name,
        type: fileType,
        variant: "chat" as const,
        isUploadDone: false,
      };
    });

    setAttachments((prev) => [...prev, ...newLocalAttachments]);
    setUploadingFields(newFileIds);

    try {
      startUpload(fileArray);
    } catch (err) {
      console.log(err);

      const failedvalues = Array.from(newFileIds.values());

      setAttachments((prev) =>
        prev.filter((i) => !failedvalues.includes(i.id))
      );
      setUploadingFields(new Map());
    }
  }, []);

  const value = useMemo(
    () => ({ addAttachment, attachments }),
    [attachments, addAttachment]
  );
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

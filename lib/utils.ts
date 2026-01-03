import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export const cn = function (...className: ClassValue[]) {
  return twMerge(clsx(className));
};

export const fileToBase64 = async function (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export function getFileType(
  fileName: string,
  mimeType: string
): "image" | "pdf" | "docx" | "txt" | "video" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (mimeType.startsWith("text/")) return "txt";
  if (mimeType.startsWith("video/")) return "video";

  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  if (ext === "txt" || ext === "md") return "txt";

  return "txt";
}

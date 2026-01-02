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

import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export const cn = function (...className: ClassValue[]) {
  return twMerge(clsx(className));
};

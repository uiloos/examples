import { MouseEvent, ReactNode } from "react";

export type SegmentedButtonItem = {
  onClick(event: MouseEvent): void;
  label: ReactNode;
  active?: boolean;
};

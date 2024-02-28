import { ReactNode } from "react";

export type AccordionItem = {
  id: number | string;
  summary: ReactNode;
  content: ReactNode;
};

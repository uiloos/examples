import { ReactNode, createContext } from "react";

export type Props = {
  name: ReactNode;
  href: string;
  children: ReactNode;
};

export function Tab(props: Props) {
  return null; // Renderig happens in Tabs
}

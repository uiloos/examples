import { ActiveList } from "@uiloos/core";
import { createContext } from "react";
import { TabInfo } from "./types";

export const TabsActiveListContext = createContext<ActiveList<TabInfo>>(
  new ActiveList(),
);
export const TabsActiveContext = createContext<string>("");

import { ActiveList } from "@uiloos/core";
import type { InjectionKey, Ref } from "vue";
import { TabInfo } from "./types";

export const tabInjectionKey = Symbol() as InjectionKey<ActiveList<TabInfo>>;

export const activeInjectionKey = Symbol() as InjectionKey<Ref<string>>;

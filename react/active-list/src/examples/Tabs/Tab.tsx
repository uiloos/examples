import { ReactNode, useContext, useEffect } from "react";
import { TabsActiveListContext, TabsActiveContext } from "./TabsContext";

export type Props = {
  name: ReactNode;
  href: string;
  children: ReactNode;
};

export function Tab({ children, name, href }: Props) {
  const tabs = useContext(TabsActiveListContext);

  useEffect(() => {
    if (!tabs.contents.some((c) => c.value.name === name)) {
      tabs.push({ name, href });
    }
  }, []);

  const activeHref = useContext(TabsActiveContext);

  if (activeHref !== href) {
    return null;
  }

  return <div className="tab-content">{children}</div>;
}

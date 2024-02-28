import { ReactNode, useEffect } from "react";
import "./Tabs.css";
import { useActiveList } from "@uiloos/react";
import { TabInfo } from "./types";
import classNames from "classnames";
import { TabsActiveContext, TabsActiveListContext } from "./TabsContext";

type Props = {
  children: ReactNode;
};

export function Tabs({ children }: Props) {
  const tabs = useActiveList<TabInfo>({
    contents: [],
  });

  const activeTab = tabs.lastActivated?.href ?? window.location.hash;

  useEffect(() => {
    // Activate the first tab if no hash is available.
    if (activeTab === "") {
      tabs.activateFirst();
      return;
    }

    // Find the content that matches the hash and activate it.
    for (const content of tabs.contents) {
      if (content.value.href === activeTab) {
        content.activate();
        return;
      }
    }
  }, []);

  return (
    <div className="tabs">
      <div className="tabs-container">
        {tabs.contents.map((content) => (
          <a
            key={content.value.href}
            href={content.value.href}
            onClick={() => content.activate()}
            className={classNames("tab", { active: content.isActive })}
          >
            {content.value.name}
          </a>
        ))}
      </div>

      <TabsActiveListContext.Provider value={tabs}>
        <TabsActiveContext.Provider value={activeTab}>
          {children}
        </TabsActiveContext.Provider>
      </TabsActiveListContext.Provider>
    </div>
  );
}

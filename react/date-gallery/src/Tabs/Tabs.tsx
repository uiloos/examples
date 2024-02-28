import React, { ReactNode, Children } from "react";
import "./Tabs.css";
import { useActiveList } from "@uiloos/react";
import { Tab, Props as TabProps } from "./Tab";
import classNames from "classnames";

type Props = {
  children: ReactNode;
};

export function Tabs({ children }: Props) {
  const contents = Children.map(children, (child) => {
    // @ts-expect-error Allow me to check for Tab like this
    if (typeof child !== "object" || child.type !== Tab) {
      throw new Error("Please provide a Tab component");
    }

    // @ts-expect-error This is a Tab
    return child.props as TabProps;
  }) as TabProps[];

  const tabs = useActiveList({
    contents,
    active:
      contents.find((content) => content.href === window.location.hash) ??
      contents[0],
  });

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

      <div className="tab-content">
        {tabs.lastActivatedContent?.value.children}
      </div>
    </div>
  );
}

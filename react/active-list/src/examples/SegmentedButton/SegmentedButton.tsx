import "./SegmentedButton.css";
import { useActiveList } from "@uiloos/react";
import { SegmentedButtonItem } from "./types";
import classNames from "classnames";

type Props = {
  buttons: SegmentedButtonItem[];
};

export function SegmentedButton({ buttons }: Props) {
  const segmentedButton = useActiveList({
    contents: buttons,
    active: buttons.find((button) => button.active),
  });

  return (
    <div className="segment-container">
      {segmentedButton.contents.map((content) => (
        <button
          key={content.index}
          onClick={(event) => {
            content.activate();
            content.value.onClick(event);
          }}
          className={classNames({ active: content.isActive })}
        >
          {content.value.label}
        </button>
      ))}
    </div>
  );
}

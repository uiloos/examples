import { useActiveList } from "@uiloos/react";
import { TimelineItem } from "./types";
import "./Timeline.css";
import classNames from "classnames";

type Props = {
  items: TimelineItem[];
};

export function Timeline({ items }: Props) {
  const timeline = useActiveList({
    contents: items,
    active: items[0],
  });

  return (
    <div className="timeline">
      <ol className="timeline-list">
        {timeline.contents.map((content) => (
          <li
            key={content.value.id}
            className={classNames("timeline-item", {
              current: content.isActive,
              seen: content.hasBeenActiveBefore,
              next: content.isNext,
            })}
          >
            <button onClick={() => content.activate()}>
              <span className="timeline-item-label">{content.value.name}</span>
              <span className="timeline-item-time">
                {content.value.released}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div id="timeline-content-0" className="timeline-content">
        <div className="timeline-content-controls">
          <button
            className="timeline-previous"
            type="button"
            onClick={() => timeline.activatePrevious()}
          >
            ‹
          </button>

          <h1>{timeline.lastActivated?.name}</h1>

          <button
            className="timeline-next"
            type="button"
            onClick={() => timeline.activateNext()}
          >
            ›
          </button>
        </div>

        <p>{timeline.lastActivated?.description}</p>
      </div>
    </div>
  );
}

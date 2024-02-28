import { ActiveListContent } from "@uiloos/core";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Slide } from "./types";

type Props = {
  content: ActiveListContent<Slide>;
};

export function ProgressButton({ content }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const { isPlaying, duration } = content.activeList.autoPlay;

  // Trigger button animation based on isPlaying state
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.style.animationPlayState = "running";
      } else {
        ref.current.style.animationPlayState = "paused";
      }
    }
  }, [isPlaying, content.isActive]);

  // Activate the animation when the content is active.
  useEffect(() => {
    if (ref.current && content.isActive) {
      ref.current.style.animation = `progress ${duration}ms linear`;
    }
  }, [duration, content.isActive]);

  return (
    <button
      ref={ref}
      className={classNames({ active: content.isActive })}
      onClick={() => content.activate()}
    ></button>
  );
}

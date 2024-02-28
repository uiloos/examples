import { ActiveListAutoPlay } from "@uiloos/core";
import { useEffect, useRef } from "react";

type Props = {
  autoPlay: ActiveListAutoPlay;
  hide: boolean;
};

export function Progress({ autoPlay, hide }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { isPlaying, duration } = autoPlay;

  // Activate the animation
  useEffect(() => {
    if (ref.current) {
      ref.current.style.animation = `progress ${duration}ms linear`;
    }
  }, [duration]);

  // Trigger progress animation based on isPlaying state
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.style.animationPlayState = "running";
      } else {
        ref.current.style.animationPlayState = "paused";
      }
    }
  }, [isPlaying]);

  return (
    <div
      ref={ref}
      className="snap-carousel-progress"
      style={{ background: hide ? "white" : undefined }}
    ></div>
  );
}

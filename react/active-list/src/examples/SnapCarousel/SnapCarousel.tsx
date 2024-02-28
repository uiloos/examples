import { useEffect, useState, useRef } from "react";
import { useActiveList } from "@uiloos/react";
import { Slide } from "./types";
import { Progress } from "./Progress";
import "./SnapCarousel.css";

type Props = {
  slides: Slide[];
};

export function SnapCarousel({ slides }: Props) {
  const carousel = useActiveList({
    // The slides will be the contents of the ActiveList
    contents: slides,
    active: slides[0],

    autoPlay: {
      // Each slide should take 6000 milliseconds, note
      // that you can also provide a function so each
      // slide has a unique duration.
      duration: 6000,
    },

    // Make the last slide go to the first slice and vice versa
    isCircular: true,
  });

  const [userTookOver, setUserTookover] = useState(false);

  // Unfortunately there is no way of knowing whether or
  // not a scroll happend programmatically via "scrollIntoView"
  // or by the end user.
  const carouselIsScrolling = useRef(false);
  const carouselRef = useRef<HTMLUListElement | null>(null);

  function onMouseEnter() {
    carousel.pause();
  }

  function onMouseLeave() {
    if (!carousel.autoPlay.hasBeenStoppedBefore) {
      carousel.play();
    }
  }

  function onScroll() {
    // In browser that do not support "onscrollend"
    // stop the carousel when not playing. This does
    // lead to a funky behavior: when the carousel
    // is scrolling and the user hovers over the
    // carousel at that moment, the carousel will
    // stop.
    if (!("onscrollend" in window) && !carousel.autoPlay.isPlaying) {
      carousel.stop();
      return;
    }

    // If the carousel is scrolling automatically no not stop.
    if (carouselIsScrolling.current) {
      return;
    }

    // The scroll event is also triggered by the ACTIVATED scrollIntoView
    // and we want to ignore that. We know when the user hovers over the
    // carousel that is is "paused", so if it is playing at this moment
    // we know it is an carousel ACTIVATED scroll
    if (!carousel.autoPlay.isPlaying) {
      carousel.stop();
      setUserTookover(true);
    }
  }

  // React does not support an onScrollEnd event yet so we add it via a useEffect.
  // It will be soon: https://github.com/facebook/react/pull/26789
  useEffect(() => {
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;

      // Note: "safari" does not support "scrollend" yet.
      // This is called multiple times for some reason,
      // when scrolling via "scrollIntoView" so it must be debounced.
      let snapScrollEndTimerId = -1;

      // eslint-disable-next-line no-inner-declarations
      function scrollEnd() {
        window.clearTimeout(snapScrollEndTimerId);

        snapScrollEndTimerId = window.setTimeout(() => {
          carouselIsScrolling.current = false;
        }, 500);
      }

      carouselElement.addEventListener("scrollend", scrollEnd);

      return () => {
        carouselElement.removeEventListener("scrollend", scrollEnd);
        window.clearTimeout(snapScrollEndTimerId);
      };
    }
  }, []);

  // Scroll to the current active slide.
  useEffect(() => {
    // Mark that the carousel started scrolling
    carouselIsScrolling.current = true;

    // scroll the carousel to the activated slide.
    carouselRef.current?.scrollTo({
      top: 0,
      left: carousel.lastActivatedIndex * carouselRef.current.clientWidth,
      behavior: "smooth",
    });

    // Now this is the magic trick: we take the previous
    // slide and move it to the last position. This creates
    // an infinitely scrolling snap carousel.
    // Do perform the move after a timeout however, so the move
    // does not affect the smooth scroll of the next slide.
    window.setTimeout(() => {
      carousel.lastDeactivatedContent?.moveToLast();

      // Reset the scrollLeft, needed for Safari
      // and FireFox otherwise the wrong slide
      // will be shown.
      window.setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = 0;
        }
      }, 1);
    }, 1000);
  }, [carousel.lastActivatedIndex, carousel.lastDeactivatedContent]);

  return (
    <div>
      {/* 
        By giving it a key based on the lastActivated slide 
        Progress will re-render, and thus restart the animation, 
        whenever the slide changes.
      */}
      <Progress
        key={carousel.lastActivated?.id}
        autoPlay={carousel.autoPlay}
        hide={userTookOver}
      />
      <ul
        ref={carouselRef}
        className="snap-carousel"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onScroll={onScroll}
      >
        {carousel.contents.map((content) => {
          const owl = content.value;

          return (
            <li
              key={owl.id}
              id={`snap-carousel-slide-${owl.id}`}
              className="slide"
            >
              <img
                width="1920"
                height="1280"
                src={owl.img.src}
                alt={`a ${owl.name}`}
              />
              <article>
                <h4>{owl.name}</h4>
                <p>{owl.description}</p>

                <p>
                  Photo by{" "}
                  <a
                    href={owl.img.attribution}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {owl.img.author}
                  </a>
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useLayoutEffect, useState } from "react";
import { useActiveList } from "@uiloos/react";
import { Slide } from "./types";
import { ProgressButton } from "./ProgressButton";
import "./ClassicCarousel.css";

type Props = {
  slides: Slide[];
};

const ANIMATION_DURATION = 500;

export function ClassicCarousel({ slides }: Props) {
  const carousel = useActiveList({
    contents: slides,
    active: slides[0],
    autoPlay: {
      // Each slide should take 5000 milliseconds, note
      // that you can also provide a function so each
      // slide has a unique duration.
      duration: 5000,

      // Stop the autoplay whenever an action occurs
      // by a human.
      stopsOnUserInteraction: true,
    },
    // Prevent user interaction until the animation
    // is complete
    cooldown: ANIMATION_DURATION,
    // Make the last slide go to the first slice and vice versa
    isCircular: true,
  });

  // These will contain the CSS classes for the active slide,
  // and the previous slide. I'm using a simple useState for
  // the animations but you can use any React based animation
  // library.
  const [activeCss, setActiveCss] = useState("slide active");
  const [previousCss, setPreviousCss] = useState("slide");

  // The slide animation is triggerd within this effect.
  // It is a useLayoutEffect so the slide in and out
  // animations can be triggered at the exact same time.
  useLayoutEffect(() => {
    // When the carousel is first rendered there is no previous
    // slide, in that case do nothing.
    if (!carousel.lastDeactivated) {
      return;
    }

    // First put the newly active slide off-screen so we
    // can animate it in.
    setActiveCss(`slide ${carousel.direction}`);

    // Next position the previous slide to be front and center.
    setPreviousCss(`slide active`);

    // Now that the slides are in place trigger the animation
    // on the next animation frame.
    requestAnimationFrame(() => {
      // Now slide the active slide in.
      setActiveCss(`slide active animate`);

      // And at the same time slide out the previously active slide
      // to the opposite direction.
      setPreviousCss(`slide animate ${carousel.oppositeDirection}`);
    });
  }, [
    carousel.direction,
    carousel.lastDeactivated,
    carousel.oppositeDirection,
  ]);

  function onMouseEnter() {
    carousel.pause();
  }

  function onMouseLeave() {
    // Only when the user has not assumed control do
    // we start playing again.
    if (!carousel.autoPlay.hasBeenStoppedBefore) {
      carousel.play();
    }
  }

  return (
    <div
      className="classic-carousel"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul>
        {carousel.contents.map((content) => {
          const owl = content.value;

          return (
            <li
              key={owl.id}
              aria-hidden={!content.isActive}
              className={
                content.isActive
                  ? activeCss
                  : carousel.lastDeactivatedContent === content
                  ? previousCss
                  : "slide"
              }
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
                  Photo by
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

      <ul className="progress">
        {carousel.contents.map((content) => (
          <li key={content.value.id}>
            <ProgressButton content={content} />
          </li>
        ))}
      </ul>

      <div className="controls">
        <div className="controls-container">
          <button onClick={() => carousel.activatePrevious()} type="button">
            ‹
          </button>

          <button onClick={() => carousel.activateNext()} type="button">
            ›
          </button>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        Owl {carousel.lastActivatedIndex + 1} of 5
      </div>
    </div>
  );
}

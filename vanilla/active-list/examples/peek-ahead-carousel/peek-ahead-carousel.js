// Get a reference to the carousel element
const peekAheadCarouselEl = document.getElementById("peek-ahead-carousel");
// Get a reference to the progress element
const peekAheadProgressEl = document.getElementById(
  "peek-ahead-carousel-progress"
);

// Unfortunately there is no way of knowing whether or
// not a scroll happend programmatically via "scrollIntoView"
// or by the end user.
let peekCarouselIsScrolling = false;

const peekAheadCarousel = new window.uiloosActiveList.ActiveList(
  {
    // The slides will be the contents of the ActiveList
    contents: Array.from(peekAheadCarouselEl.querySelectorAll(".slide")),
    // Start at the second slide so there is content
    // on both the left and the right, if started on the
    // 0 index, we would show a slide without a previous
    // slide, which looks sloppy.
    activeIndexes: [0, 1],

    // The last activated slide is the one we are going to show.
    // The slide that was active two slides ago we are going to
    // move. The trick here is that while the ActiveList considers
    // three slides to be active, we only consider the last active
    // slide active.
    maxActivationLimit: 3,

    autoPlay: {
      // Each slide should take 5000 milliseconds, note
      // that you can also provide a function so each
      // slide has a unique duration.
      duration: 5000
    },
    // Make the last slide go to the first slice and vice versa
    isCircular: true
  },
  new window.uiloosActiveList.createActiveListSubscriber({
    onInitialized(event, carousel) {
      // Start the progress animation
      peekAheadProgressEl.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;

      // Since we show the "second" slide initially have to
      // scroll instantly to that slide on initialization.
      peekAheadCarouselEl.scrollTo({
        top: 0,
        left: carousel.lastActivatedIndex * peekAheadCarouselEl.clientWidth,
        behavior: "instant"
      });
    },

    onAutoPlayPaused() {
      // Halt the animation when paused
      peekAheadProgressEl.style.animationPlayState = "paused";
    },

    onAutoPlayPlaying() {
      // Resume animation when playing
      peekAheadProgressEl.style.animationPlayState = "running";
    },

    onAutoPlayStopped() {
      // Remove the progress indicator now that the user has
      // assumed full control over the carousel.
      peekAheadProgressEl.style.background = "white";
    },

    onActivated(event, carousel) {
      // Mark that the carousel started scrolling
      peekCarouselIsScrolling = true;

      // scroll the carousel to the activated slide.
      peekAheadCarouselEl.scrollTo({
        top: 0,
        left: carousel.lastActivatedIndex * peekAheadCarouselEl.clientWidth,
        behavior: "smooth"
      });

      // Technically the animation needs not be reset,
      // since all slides have the same duration. But
      // if you'd change the autoPlay duration to a
      // function the progress would be wrong.
      peekAheadProgressEl.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;

      // By removing the node and inserting it again
      // the animation is restarted.
      peekAheadProgressEl.remove();
      peekAheadCarouselEl.parentElement.insertBefore(
        peekAheadProgressEl,
        peekAheadCarouselEl
      );

      // Now this is the magic trick: we take the previous
      // slide and move it to the last position. This creates
      // an infinitely scrolling snap carousel.
      // But because we show a litte of the the previous
      // and next slides, (peek ahead) we need actually need to move
      // the slide that was shown two iterations ago.
      const previousPreviousSlide = carousel.activeContents[0];

      // Do perform the move after a timeout however, so the move
      // does not affect the smooth scroll of the next slide.
      window.setTimeout(() => {
        // When you append an element which is already a child
        // it will get moved, so there is no need to remove the
        // element first.
        peekAheadCarouselEl.append(previousPreviousSlide.value);

        // Now also update the ActiveList itself
        previousPreviousSlide.moveToLast();

        // Reset the scrollLeft, needed for Safari
        // and FireFox otherwise the wrong slide
        // will be shown.
        peekAheadCarouselEl.scrollLeft = peekAheadCarouselEl.clientWidth;
      }, 1000);
    }
  })
);

// Disable the carousel when users mouse enters the carousel
peekAheadCarouselEl.addEventListener("mouseenter", () => {
  peekAheadCarousel.pause();
});

// Enable the carousel again when users mouse exits the carousel.
peekAheadCarouselEl.addEventListener("mouseleave", () => {
  if (!peekAheadCarousel.autoPlay.hasBeenStoppedBefore) {
    peekAheadCarousel.play();
  }
});

peekAheadCarouselEl.addEventListener("scroll", () => {
  // In browser that do not support "onscrollend"
  // stop the carousel when not playing. This does
  // lead to a funky behavior: when the carousel
  // is scrolling and the user hovers over the
  // carousel at that moment, the carousel will
  // stop.
  if (!("onscrollend" in window) && !peekAheadCarousel.autoPlay.isPlaying) {
    peekAheadCarousel.stop();
    return;
  }

  // If the carousel is scrolling automatically no not stop.
  if (peekCarouselIsScrolling) {
    return;
  }

  // The scroll event is also triggered by the ACTIVATED scrollIntoView
  // and we want to ignore that. We know when the user hovers over the
  // carousel that is is "paused", so if it is playing at this moment
  // we know it is an carousel ACTIVATED scroll
  if (!peekAheadCarousel.autoPlay.isPlaying) {
    peekAheadCarousel.stop();
  }
});

// Note: "safari" does not support "scrollend" yet.
// This is called multiple times for some reason,
// when scrolling via "scrollIntoView" so it must be debounced.
let peekScrollEndTimerId = -1;
peekAheadCarouselEl.addEventListener("scrollend", () => {
  window.clearTimeout(peekScrollEndTimerId);

  peekScrollEndTimerId = window.setTimeout(() => {
    peekCarouselIsScrolling = false;
  }, 500);
});

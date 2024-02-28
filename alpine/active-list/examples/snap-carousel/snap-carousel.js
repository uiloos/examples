document.addEventListener("alpine:init", () => {
  /*
    The carousel has a lot of logic possible to express
    inside of HTML, so sometimes you need to fall back 
    to using JavaScript in alpine. By writing the JavaScript 
    inside of a custom Alpine.data. 
    
    The benefit is that you can now reuse the "component" multiple 
    times on the same page.

    The downside is that you now need to sync with the DOM
    manually again.
  */
  Alpine.data("SnapCarousel", () => {
    let snapCarousel = null;

    return {
      init() {
        // Get a reference to the carousel element
        const snapCarouselEl = this.$el.querySelector(".snap-carousel");
        // Get a reference to the progress element
        const snapProgressEl = this.$el.querySelector(
          ".snap-carousel-progress"
        );

        // Unfortunately there is no way of knowing whether or
        // not a scroll happend programmatically via "scrollIntoView"
        // or by the end user.
        let snapCarouselIsScrolling = false;

        snapCarousel = new window.uiloosActiveList.ActiveList(
          {
            // The slides will be the contents of the ActiveList
            contents: Array.from(this.$el.querySelectorAll(".slide")),
            activeIndexes: [0],
            // Make the last slide go to the first slice and vice versa
            isCircular: true,

            autoPlay: {
              // Each slide should take 7000 milliseconds, note
              // that you can also provide a function so each
              // slide has a unique duration.
              duration: 7000
            }
          },
          window.uiloosActiveList.createActiveListSubscriber({
            onInitialized(event, carousel) {
              // Start the progress animation
              snapProgressEl.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;
            },

            onAutoPlayPaused() {
              // Halt the animation when paused
              snapProgressEl.style.animationPlayState = "paused";
            },

            onAutoPlayPlaying() {
              // Set to running when playing / unpaused
              snapProgressEl.style.animationPlayState = "running";
            },

            onAutoPlayStopped() {
              // Remove the progress indicator now that the user has
              // assumed full control over the carousel.
              snapProgressEl.style.background = "white";
            },

            onActivated(event, carousel) {
              // Mark that the carousel started scrolling
              snapCarouselIsScrolling = true;

              // scroll the carousel to the activated slide.
              snapCarouselEl.scrollTo({
                top: 0,
                left: carousel.lastActivatedIndex * snapCarouselEl.clientWidth,
                behavior: "smooth"
              });

              // Technically the animation needs not be reset,
              // since all slides have the same duration. But
              // if you'd change the autoPlay duration to a
              // function the progress would be wrong.
              snapProgressEl.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;

              // By removing the node and inserting it again
              // the animation is restarted.
              snapProgressEl.remove();
              snapCarouselEl.parentElement.insertBefore(
                snapProgressEl,
                snapCarouselEl
              );

              // Now this is the magic trick: we take the previous
              // slide and move it to the last position. This creates
              // an infinitely scrolling snap carousel.
              // Do perform the move after a timeout however, so the move
              // does not affect the smooth scroll of the next slide.
              window.setTimeout(() => {
                // When you append an element which is already a child
                // it will get moved, so there is no need to remove the
                // element first.
                snapCarouselEl.append(carousel.lastDeactivated);

                // Now also update the ActiveList itself
                carousel.lastDeactivatedContent.moveToLast();

                // Reset the scrollLeft, needed for Safari
                // and FireFox otherwise the wrong slide
                // will be shown.
                snapCarouselEl.scrollLeft = 0;
              }, 1000);
            }
          })
        );

        // Disable the carousel when users mouse enters the carousel
        snapCarouselEl.addEventListener("mouseenter", () => {
          snapCarousel.pause();
        });

        // Enable the carousel again when users mouse exits the carousel.
        snapCarouselEl.addEventListener("mouseleave", () => {
          if (!snapCarousel.autoPlay.hasBeenStoppedBefore) {
            snapCarousel.play();
          }
        });

        // When the user scrolls stop the autoplay, the user now takes over.
        snapCarouselEl.addEventListener("scroll", () => {
          // In browser that do not support "onscrollend"
          // stop the carousel when not playing. This does
          // lead to a funky behavior: when the carousel
          // is scrolling and the user hovers over the
          // carousel at that moment, the carousel will
          // stop.
          if (!("onscrollend" in window) && !snapCarousel.autoPlay.isPlaying) {
            snapCarousel.stop();
            return;
          }

          // If the carousel is scrolling automatically no not stop.
          if (snapCarouselIsScrolling) {
            return;
          }

          // The scroll event is also triggered by the ACTIVATED scrollIntoView
          // and we want to ignore that. We know when the user hovers over the
          // carousel that is is "paused", so if it is playing at this moment
          // we know it is an carousel ACTIVATED scroll
          if (!snapCarousel.autoPlay.isPlaying) {
            snapCarousel.stop();
          }
        });

        // Note: "safari" does not support "scrollend" yet.
        // This is called multiple times for some reason,
        // when scrolling via "scrollIntoView" so it must be debounced.
        let snapScrollEndTimerId = -1;
        snapCarouselEl.addEventListener("scrollend", () => {
          window.clearTimeout(snapScrollEndTimerId);

          snapScrollEndTimerId = window.setTimeout(() => {
            snapCarouselIsScrolling = false;
          }, 500);
        });
      },

      destroy() {
        snapCarousel.unsubscribeAll();
      }
    };
  });
});

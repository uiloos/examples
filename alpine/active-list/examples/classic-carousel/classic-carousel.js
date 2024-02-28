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
  Alpine.data("ClassicCarousel", () => {
    let classicCarousel = null;

    return {
      init() {
        const carouselEl = this.$el;

        // First get all slides
        const slideEls = Array.from(carouselEl.querySelectorAll(".slide"));

        // Then to represent the contents of the ActiveList turn the slideEls into
        // an array of numbers. This makes it easier to get the corresponding
        // progress button when a slide is activated.
        const slides = slideEls.map((e, index) => index);

        // Reference to the live region for accessibility
        // announcements, is visually hidden.
        const carouselCurrentActive = carouselEl.querySelector(
          "#carousel-current-active"
        );

        classicCarousel = new window.uiloosActiveList.ActiveList(
          {
            contents: slides,
            activeIndexes: [0],

            autoPlay: {
              // Each slide should take 4000 milliseconds, note
              // that you can also provide a function so each
              // slide has a unique duration.
              duration: 4000,

              // Stop the autoplay whenever an action occurs
              // by a human.
              stopsOnUserInteraction: true
            },
            // Make the last slide go to the first slice and vice versa
            isCircular: true,
            // Prevent user interaction until the animation
            // is complete
            cooldown: 500
          },
          new window.uiloosActiveList.createActiveListSubscriber({
            onInitialized(event, carousel) {
              // Trigger the animation for the initial active button,
              // then exit.
              const button = carouselEl.querySelector(
                `#classic-carousel-button-${carousel.lastActivated}`
              );

              button.classList.add("active");
              button.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;
            },

            onAutoPlayPaused(event, carousel) {
              // Halt the animation when paused
              const button = carouselEl.querySelector(
                `#classic-carousel-button-${carousel.lastActivated}`
              );

              button.style.animationPlayState = "paused";
            },

            onAutoPlayPlaying(event, carousel) {
              // Resume animation when playing
              const button = carouselEl.querySelector(
                `#classic-carousel-button-${carousel.lastActivated}`
              );

              button.style.animationPlayState = "running";
            },

            onActivated(event, carousel) {
              // Set the text for the live-region for accessibity text.
              carouselCurrentActive.textContent =
                carousel.lastActivatedIndex + 1;

              // Now animate the active slide in.
              const activatedSlide = carouselEl.querySelector(
                `#classic-carousel-slide-${carousel.lastActivated}`
              );

              // Make the slide visible for accessibility
              activatedSlide.ariaHidden = "false";

              // Reset the class name to make it easier to reason about.
              activatedSlide.className = "slide";

              // Request animation frame so the animation
              // is less janky.
              requestAnimationFrame(() => {
                // The ActiveList knows which direction it
                // went, by setting it as the CSS class it
                // will move the newly active slide ofscreen
                // to that position.
                activatedSlide.classList.add(carousel.direction);

                // Now that the new active slide is in position
                // animate it so it takes center stage.
                requestAnimationFrame(() => {
                  activatedSlide.classList.add("animate", "active");
                });
              });

              // Get a reference to this slide's <li> element
              // so we can animate it.
              const deactivatedSlide = carouselEl.querySelector(
                `#classic-carousel-slide-${carousel.lastDeactivated}`
              );

              // Hide the slide for accessibility
              deactivatedSlide.ariaHidden = "true";

              // Reset the class name to make it easier to reason about.
              deactivatedSlide.className = "slide";

              requestAnimationFrame(() => {
                // Make this slide active so it takes
                // center stage.
                deactivatedSlide.classList.add("active");

                // Frame is so that there is no "white"
                // gap between the slides. By sliding the
                // old active slide slightly later there
                // is always an overlap which looks nicer
                // visually.
                requestAnimationFrame(() => {
                  // Make it so it is no longer the active slide.
                  deactivatedSlide.classList.remove("active");

                  // Now move it to the opposite direction
                  // of the carousel so it slides out.
                  deactivatedSlide.classList.add(
                    "animate",
                    carousel.oppositeDirection
                  );
                });
              });

              // Start the animation for the active button.
              const activatedButton = carouselEl.querySelector(
                `#classic-carousel-button-${carousel.lastActivated}`
              );
              activatedButton.classList.add("active");
              activatedButton.style.animation = `progress ${carousel.autoPlay.duration}ms linear`;

              // Remove the animation from the deactivated button
              const deactivatedButton = carouselEl.querySelector(
                `#classic-carousel-button-${carousel.lastDeactivated}`
              );
              deactivatedButton.className = "";
              deactivatedButton.style.animation = "";
            }
          })
        );

        // Disable the carousel when users mouse enters the carousel
        carouselEl.addEventListener("mouseenter", () => {
          classicCarousel.pause();
        });

        // Enable the carousel again when users mouse exits the carousel.
        carouselEl.addEventListener("mouseleave", () => {
          // Do not play again if autoPlay was already stopped due to user interaction
          if (!classicCarousel.autoPlay.hasBeenStoppedBefore) {
            classicCarousel.play();
          }
        });

        // When next button is clicked to go next slide.
        carouselEl.querySelector("#classic-carousel-next").onclick = () => {
          classicCarousel.activateNext();
        };

        // When next button is clicked to go previous slide.
        carouselEl.querySelector("#classic-carousel-prev").onclick = () => {
          classicCarousel.activatePrevious();
        };

        // When progress buttons are clicked activate the slide.
        // the button represents.
        slides.forEach((slide) => {
          const link = carouselEl.querySelector(
            `#classic-carousel-button-${slide}`
          );
          link.onclick = () => {
            classicCarousel.activate(slide);
          };
        });
      },

      destroy() {
        classicCarousel.unsubscribeAll();
      }
    };
  });
});

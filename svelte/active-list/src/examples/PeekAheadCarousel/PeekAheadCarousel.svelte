<script lang="ts">
  import { onMount } from 'svelte';
  import { createActiveListStore } from '@uiloos/svelte';
  import type { Slide } from './types';
  import Progress from './Progress.svelte';

  export let slides: Slide[];
  let carouselElement: HTMLUListElement;

  let userTookOver = false;

  // Function is needed so svelte sees the change!
  function setUserTookOver(value: boolean) {
    userTookOver = value;
  }

  // Unfortunately there is no way of knowing whether or
  // not a scroll happend programmatically via "scrollIntoView"
  // or by the end user.
  let carouselIsScrolling = false;

  // Function is needed so svelte sees the change!
  function setCarouselIsScrolling(value: boolean) {
    carouselIsScrolling = value;
  }

  const carousel = createActiveListStore({
    // The slides will be the contents of the ActiveList
    contents: slides,

    // Start at the second slide so there is content
    // on both the left and the right, if started on the
    // 0 index, we would show a slide without a previous
    // slide, which looks sloppy.
    activeIndexes: [0, 1],
    autoPlay: {
      // Each slide should take 5000 milliseconds, note
      // that you can also provide a function so each
      // slide has a unique duration.
      duration: 5000,
    },

    // The last activated slide is the one we are going to show.
    // The slide that was active two slides ago we are going to
    // move. The trick here is that while the ActiveList considers
    // three slides to be active, we only consider the last active
    // slide active.
    maxActivationLimit: 3,

    // Make the last slide go to the first slice and vice versa
    isCircular: true,
  });

  $: scrollToSlide($carousel.lastActivatedContent?.value.id ?? 0);

  // Scroll to the current active slide.
  let lastHandledSlide = -1;
  function scrollToSlide(lastActivatedSlide: number) {
    // scrollToSlide is called twice in short succession for
    // some reason, ignore that second call otherwise we get
    // a double animation.
    if (lastActivatedSlide === lastHandledSlide) {
      return;
    }
    lastHandledSlide = lastActivatedSlide;

    // Mark that the carousel started scrolling
    setCarouselIsScrolling(true);

    // scroll the carousel to the activated slide.
    carouselElement?.scrollTo({
      top: 0,
      left: $carousel.lastActivatedIndex * carouselElement.clientWidth,
      behavior: 'smooth',
    });

    // Now this is the magic trick: we take the previous
    // slide and move it to the last position. This creates
    // an infinitely scrolling snap carousel.
    // But because we show a litte of the the previous
    // and next slides, (peek ahead) we need actually need to move
    // the slide that was shown two iterations ago.
    if ($carousel.activeContents.length === 3) {
      const previousPreviousSlide = $carousel.activeContents[0];

      // Do perform the move after a timeout however, so the move
      // does not affect the smooth scroll of the next slide.
      window.setTimeout(() => {
        // Here we let React do the heavy lifting, by moving it
        // the last position, React sees that the `carousel.contents`
        // has changed, it will then re-render the component. But
        // React will also see that the items have only been
        // moved so it will re-use the actual <li /> element,
        // and place them in the correct position.
        previousPreviousSlide.moveToLast();

        // Reset the scrollLeft, needed for Safari
        // and FireFox otherwise the wrong slide
        // will be shown.
        window.setTimeout(() => {
          carouselElement.scrollLeft = carouselElement.clientWidth;
        }, 1);
      }, 1000);
    }
  }

  onMount(() => {
    // Since we show the "second" slide initially have to
    // scroll instantly to that slide on initialization.
    carouselElement?.scrollTo({
      top: 0,
      left: $carousel.lastActivatedIndex * carouselElement.clientWidth,
      behavior: 'instant',
    });
  });

  function onMouseEnter() {
    $carousel.pause();
  }

  function onMouseLeave() {
    // Only when the user has not assumed control do
    // we start playing again.
    if (!$carousel.autoPlay.hasBeenStoppedBefore) {
      $carousel.play();
    }
  }

  function onScroll() {
    // In browser that do not support "onscrollend"
    // stop the carousel when not playing. This does
    // lead to a funky behavior: when the carousel
    // is scrolling and the user hovers over the
    // carousel at that moment, the carousel will
    // stop.
    if (!('onscrollend' in window) && !$carousel.autoPlay.isPlaying) {
      $carousel.stop();
      return;
    }

    // If the carousel is scrolling automatically no not stop.
    if (carouselIsScrolling) {
      return;
    }

    // The scroll event is also triggered by the ACTIVATED scrollIntoView
    // and we want to ignore that. We know when the user hovers over the
    // carousel that is is "paused", so if it is playing at this moment
    // we know it is an carousel ACTIVATED scroll
    if (!$carousel.autoPlay.isPlaying) {
      $carousel.stop();
      setUserTookOver(true);
    }
  }

  // Note: "safari" does not support "scrollend" yet.
  // This is called multiple times for some reason,
  // when scrolling via "scrollIntoView" so it must be debounced.
  let snapScrollEndTimerId = -1;

  function onScrollEnd() {
    window.clearTimeout(snapScrollEndTimerId);

    snapScrollEndTimerId = window.setTimeout(() => {
      setCarouselIsScrolling(false);
    }, 500);
  }
</script>

<div>
  {#key $carousel.lastActivatedContent?.value.id}
    <Progress autoPlay={$carousel.autoPlay} hide={userTookOver} />
  {/key}

  <ul
    bind:this={carouselElement}
    class="peek-ahead-carousel"
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    on:scroll={onScroll}
    on:scrollend={onScrollEnd}
  >
    {#each $carousel.contents as content (content.value.id)}
      <li id={`peek-ahead-carousel-slide-${content.value.id}`} class="slide">
        <img
          width="1920"
          height="1280"
          src={content.value.img.src}
          alt={`a ${content.value.name}`}
        />
        <article>
          <h4>{content.value.name}</h4>
          <p>{content.value.description}</p>

          <p>
            Photo by{' '}
            <a
              href={content.value.img.attribution}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.value.img.author}
            </a>
          </p>
        </article>
      </li>
    {/each}
  </ul>
</div>

<style>
  .peek-ahead-carousel {
    display: flex;
    gap: 8px;
    width: 512px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    list-style-type: none;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .peek-ahead-carousel::-webkit-scrollbar {
    display: none;
  }

  .peek-ahead-carousel .slide {
    /* 
    Show the previous and next slides a little, 
    I call this peek ahead 
  */
    min-width: calc(512px - 48px);
    scroll-snap-align: center;
  }

  .peek-ahead-carousel .slide img {
    max-width: 100%;
    height: auto;
  }

  .peek-ahead-carousel article {
    padding: 12px 0px;
  }

  .peek-ahead-carousel article h4 {
    margin-bottom: 8px;
  }
</style>

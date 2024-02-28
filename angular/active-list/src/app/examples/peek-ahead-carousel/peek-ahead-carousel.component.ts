import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActiveList, createActiveListSubscriber } from '@uiloos/core';
import { ProgressComponent } from './progress.component';
import { Slide } from './types';

@Component({
  selector: 'peek-ahead-carousel',
  templateUrl: './peek-ahead-carousel.component.html',
  styleUrls: ['./peek-ahead-carousel.component.css'],
  standalone: true,
  imports: [CommonModule, ProgressComponent],
})
export class PeekAheadCarouselComponent implements OnInit, AfterViewInit {
  @Input() href = '';
  @Input() name = '';

  public userTookOver = false;

  @Input() slides!: Slide[];

  public carousel!: ActiveList<Slide>;

  @ViewChild('carouselElement') carouselElement!: ElementRef<HTMLUListElement>;

  // Unfortunately there is no way of knowing whether or
  // not a scroll happend programmatically via "scrollIntoView"
  // or by the end user.
  private carouselIsScrolling = false;

  ngOnInit(): void {
    const self = this;

    this.carousel = new ActiveList(
      {
        // The slides will be the contents of the ActiveList
        contents: this.slides,

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
      },
      createActiveListSubscriber({
        onActivated(event, carousel) {
          // Mark that the carousel started scrolling
          self.carouselIsScrolling = true;

          // scroll the carousel to the activated slide.
          self.carouselElement.nativeElement.scrollTo({
            top: 0,
            left:
              carousel.lastActivatedIndex *
              self.carouselElement.nativeElement.clientWidth,
            behavior: 'smooth',
          });

          // Now this is the magic trick: we take the previous
          // slide and move it to the last position. This creates
          // an infinitely scrolling snap carousel.
          // But because we show a litte of the the previous
          // and next slides, (peek ahead) we need actually need to move
          // the slide that was shown two iterations ago.
          if (carousel.activeContents.length === 3) {
            const previousPreviousSlide = carousel.activeContents[0];

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
                self.carouselElement.nativeElement.scrollLeft =
                  self.carouselElement.nativeElement.clientWidth;
              }, 1);
            }, 1000);
          }
        },
      }),
    );
  }

  ngAfterViewInit(): void {
    // Since we show the "second" slide initially have to
    // scroll instantly to that slide on initialization.
    this.carouselElement.nativeElement.scrollTo({
      top: 0,
      left:
        this.carousel.lastActivatedIndex *
        this.carouselElement.nativeElement.clientWidth,
    });
  }

  public onMouseEnter() {
    this.carousel.pause();
  }

  public onMouseLeave() {
    // Only when the user has not assumed control do
    // we start playing again.
    if (!this.carousel.autoPlay.hasBeenStoppedBefore) {
      this.carousel.play();
    }
  }

  public onScroll() {
    // In browser that do not support "onscrollend"
    // stop the carousel when not playing. This does
    // lead to a funky behavior: when the carousel
    // is scrolling and the user hovers over the
    // carousel at that moment, the carousel will
    // stop.
    if (!('onscrollend' in window) && !this.carousel.autoPlay.isPlaying) {
      this.carousel.stop();
      return;
    }

    // If the carousel is scrolling automatically no not stop.
    if (this.carouselIsScrolling) {
      return;
    }

    // The scroll event is also triggered by the ACTIVATED scrollIntoView
    // and we want to ignore that. We know when the user hovers over the
    // carousel that is is "paused", so if it is playing at this moment
    // we know it is an carousel ACTIVATED scroll
    if (!this.carousel.autoPlay.isPlaying) {
      this.carousel.stop();
      this.userTookOver = true;
    }
  }

  // Note: "safari" does not support "scrollend" yet.
  // This is called multiple times for some reason,
  // when scrolling via "scrollIntoView" so it must be debounced.
  private snapScrollEndTimerId = -1;

  onScrollEnd() {
    window.clearTimeout(this.snapScrollEndTimerId);

    this.snapScrollEndTimerId = window.setTimeout(() => {
      this.carouselIsScrolling = false;
    }, 500);
  }
}

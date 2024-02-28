import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActiveList, createActiveListSubscriber } from '@uiloos/core';
import { ProgressComponent } from './progress.component';
import { Slide } from './types';

@Component({
  selector: 'snap-carousel',
  templateUrl: './snap-carousel.component.html',
  styleUrls: ['./snap-carousel.component.css'],
  standalone: true,
  imports: [CommonModule, ProgressComponent],
})
export class SnapCarouselComponent implements OnInit {
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
        active: this.slides[0],
        autoPlay: {
          // Each slide should take 5000 milliseconds, note
          // that you can also provide a function so each
          // slide has a unique duration.
          duration: 5000,

          // Stop the autoplay whenever an action occurs
          // by a human.
          stopsOnUserInteraction: true,
        },
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
          // Do perform the move after a timeout however, so the move
          // does not affect the smooth scroll of the next slide.
          setTimeout(() => {
            carousel.lastDeactivatedContent?.moveToLast();

            // Reset the scrollLeft, needed for Safari
            // and FireFox otherwise the wrong slide
            // will be shown.
            setTimeout(() => {
              self.carouselElement.nativeElement.scrollLeft = 0;
            }, 1);
          }, 1000);
        },
      }),
    );
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

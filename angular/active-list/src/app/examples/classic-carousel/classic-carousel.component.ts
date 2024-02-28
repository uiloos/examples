import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActiveList, createActiveListSubscriber } from '@uiloos/core';
import { Slide } from './types';
import { ProgressButtonComponent } from './progress-button.component';

const ANIMATION_DURATION = 500;

@Component({
  selector: 'classic-carousel',
  templateUrl: './classic-carousel.component.html',
  styleUrls: ['./classic-carousel.component.css'],
  standalone: true,
  imports: [CommonModule, ProgressButtonComponent],
})
export class ClassicCarouselComponent implements OnInit {
  @Input() slides!: Slide[];

  public carousel!: ActiveList<Slide>;

  public activeCss = 'slide active';
  public previousCss = 'slide';

  ngOnInit(): void {
    const self = this;

    this.carousel = new ActiveList(
      {
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
        // Prevent user interaction until the animation
        // is complete
        cooldown: ANIMATION_DURATION,
        // Make the last slide go to the first slice and vice versa
        isCircular: true,
      },
      createActiveListSubscriber({
        onActivated(event, carousel) {
          // When the carousel is first rendered there is no previous
          // slide, in that case do nothing.
          if (!carousel.lastDeactivated) {
            return;
          }

          // First put the newly active slide off-screen so we
          // can animate it in.
          self.activeCss = `slide ${carousel.direction}`;

          // Next position the previous slide to be front and center.
          self.previousCss = `slide active`;

          // Now that the slides are in place trigger the animation
          // but do it after a timeout so the animation is not janky.
          setTimeout(() => {
            // Now slide the active slide in.
            self.activeCss = `slide active animate`;

            // And at the same time slide out the previously active slide
            // to the opposite direction.
            self.previousCss = `slide animate ${carousel.oppositeDirection}`;
          }, 100);
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
}

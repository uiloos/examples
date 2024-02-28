import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProgressComponent implements OnChanges, AfterViewInit {
  @Input() slide = -1;
  @Input() hide = false;
  @Input() isPlaying = false;
  @Input() duration = 0;

  @ViewChild('progressElement') progressElement!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.activateAnimation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the slide changes reset the animation
    if (changes['slide']?.previousValue) {
      this.resetAnimation();

      return;
    }

    this.activateAnimation();
    this.playState();
  }

  private resetAnimation() {
    const element = this.progressElement?.nativeElement;

    if (element) {
      element.style.animation = '';

      setTimeout(() => {
        this.activateAnimation();
      }, 10);
    }
  }

  private activateAnimation() {
    const element = this.progressElement?.nativeElement;

    if (element) {
      element.style.animation = `progress ${this.duration}ms linear`;
    }
  }

  private playState() {
    const element = this.progressElement?.nativeElement;

    if (element) {
      if (this.isPlaying) {
        element.style.animationPlayState = 'running';
      } else {
        element.style.animationPlayState = 'paused';
      }
    }
  }
}

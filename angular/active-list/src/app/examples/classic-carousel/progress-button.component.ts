import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: ['./progress-button.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProgressButtonComponent implements OnChanges, AfterViewInit {
  @Input() isActive = false;
  @Input() isPlaying = false;
  @Input() duration = 0;

  @ViewChild('buttonElement') buttonElement!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    this.activateAnimation();
  }

  ngOnChanges(): void {
    this.activateAnimation();
    this.playState();
  }

  private activateAnimation() {
    const element = this.buttonElement?.nativeElement;

    if (element) {
      if (this.isActive) {
        element.style.animation = `progress ${this.duration}ms linear`;
      } else {
        element.style.animation = '';
      }
    }
  }

  private playState() {
    const element = this.buttonElement?.nativeElement;

    if (element) {
      if (this.isPlaying) {
        element.style.animationPlayState = 'running';
      } else {
        element.style.animationPlayState = 'paused';
      }
    }
  }
}

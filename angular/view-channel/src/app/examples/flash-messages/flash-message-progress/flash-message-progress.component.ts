import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'flash-message-progress',
  styleUrls: ['./flash-message-progress.component.css'],
  template: `
    <div
      #progress
      [ngClass]="['flash-message-progress', 'flash-message-progress-' + type]"
    ></div>
  `,
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class FlashMessageProgressComponent implements OnChanges, AfterViewInit {
  @Input() type!: string;
  @Input() isPlaying!: boolean;
  @Input() duration!: number;

  @ViewChild('progress') progress!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.progress.nativeElement.style.animation = `progress ${this.duration}ms ease-out`;

    this.toggleAnimation();
  }

  ngOnChanges() {
    // Do nothing if the #progress element is not loaded yet
    if (!this.progress) {
      return;
    }

    this.toggleAnimation();
  }

  toggleAnimation() {
    if (this.isPlaying) {
      this.progress.nativeElement.style.animationPlayState = 'running';
    } else {
      this.progress.nativeElement.style.animationPlayState = 'paused';
    }
  }
}

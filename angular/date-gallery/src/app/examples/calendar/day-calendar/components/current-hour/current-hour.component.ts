import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import {
  DateGallery,
  createDateGallerySubscriber,
  UnsubscribeFunction,
} from '@uiloos/core';
import { EventData } from '../../../events';
import { timeFormatter } from 'src/app/examples/formatters';
import { START_HOUR } from '../../config';
import { getMinutesSinceStart } from '../../../utils';

@Component({
  selector: 'current-hour',
  templateUrl: './current-hour.component.html',
  styleUrl: './current-hour.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class CurrentHourComponent implements OnInit, OnDestroy {
  /* 
    Needed to project the <li> directly into the <ul> so the CSS
    grid works. Angular by default adds an element to the DOM
    to track changes, which breaks the CSS grid.
    
    In the future you might use:

    :host {
     display: contents;
    }

    What `display: contents` does is treat the first child of a
    element as the element itself. This would be an ideal solution
    for this problem, but it is not fully supported yet without 
    accessibility bugs see: https://caniuse.com/css-display-contents.
  */
  @ViewChild('template', { static: true }) template!: TemplateRef<HTMLElement>;

  @Input() dateGallery!: DateGallery<EventData>;
  @Input() rows!: string;

  @ViewChild('ref') ref!: ElementRef<HTMLDivElement>;

  private unsubscribe: UnsubscribeFunction | null = null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);

    this.sync();

    const self = this;
    this.unsubscribe = this.dateGallery.subscribe(
      createDateGallerySubscriber({
        onFrameChanged() {
          self.sync();
        },
      }),
    );
  }

  private interval = -1;

  sync() {
    clearInterval(this.interval);

    if (this.dateGallery.firstFrame.dates[0].isToday) {
      this.interval = window.setInterval(() => {
        this.update();
      }, 1000);

      // Trigger update after 1 ms so the ref is filled in,
      // without this timeout it would take 1s for the
      // indicator to show up.
      setTimeout(() => {
        this.update();
      }, 1);
    }
  }

  update() {
    if (!this.ref.nativeElement) {
      return;
    }

    const now = new Date();
    const column = getMinutesSinceStart(now, START_HOUR);
    this.ref.nativeElement.style.gridColumn = `${column} / ${column + 1}`;

    this.ref.nativeElement.setAttribute('time', timeFormatter.format(now));
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getStyle() {
    return {
      gridRow: `1 / ${this.rows}`,
    };
  }
}

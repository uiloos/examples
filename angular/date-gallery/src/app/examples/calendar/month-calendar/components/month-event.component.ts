import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  DateGallery,
  DateGalleryEvent,
  DateGalleryDate,
  createDateGallerySubscriber,
  UnsubscribeFunction,
} from '@uiloos/core';
import { EventData, ariaLabelForEvent } from '../../events';
import { emptyImage, yiq } from '../../utils';
import { timeFormatter } from '../../../formatters';

@Component({
  selector: 'month-event',
  templateUrl: './month-event.component.html',
  styleUrl: './month-event.component.css',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthEventComponent implements OnInit, OnDestroy {
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
  @Input() event!: DateGalleryEvent<EventData>;
  @Input() dateObj!: DateGalleryDate<EventData>;
  @Input() gridRow!: number;

  @Output() click = new EventEmitter<void>();
  @Output() drag = new EventEmitter<DateGalleryEvent<EventData>>();

  public yiq: typeof yiq;
  public ariaLabelForEvent: typeof ariaLabelForEvent;

  public title = '';
  public time = '';

  constructor(private viewContainerRef: ViewContainerRef) {
    this.yiq = yiq;
    this.ariaLabelForEvent = ariaLabelForEvent;
  }

  private unsubscribe: UnsubscribeFunction | null = null;

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);

    this.sync();

    const self = this;
    this.unsubscribe = this.dateGallery.subscribe(
      createDateGallerySubscriber({
        onEventDataChanged(e) {
          if (e.data.id === self.event.data.id) {
            self.sync();
          }
        },
        onEventMoved(e) {
          if (e.event.data.id === self.event.data.id) {
            self.sync();
          }
        },
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  sync() {
    if (this.event.spansMultipleDays) {
      /*
        An event that spans multiple days is rendered once in each
        day the event occurs.

        On the startDate we render the title and start time, on the
        endDate we render the end time. For all days in between we
        only give it a background color.
      */
      if (this.dateGallery.isSameDay(this.event.startDate, this.dateObj.date)) {
        this.title = this.event.data.title;
        this.time = timeFormatter.format(this.event.startDate);
      } else if (
        this.dateGallery.isSameDay(this.event.endDate, this.dateObj.date)
      ) {
        this.time = timeFormatter.format(this.event.endDate);
      }
    } else {
      // When an event happens on a single day show the title and start time.
      this.title = this.event.data.title;
      this.time = timeFormatter.format(this.event.startDate);
    }
  }

  onDragStart(e: DragEvent) {
    e.stopPropagation();

    this.drag.emit(this.event);

    // Set the drag image to an empty image. Because we are
    // going to continuously "move" the event we do not need
    // a "ghost".
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(emptyImage, 0, 0);
    }
  }

  onEventClicked(e: Event) {
    e.stopPropagation();
    this.click.emit();
  }
}

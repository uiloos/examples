import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  DateGallery,
  DateGalleryEvent,
  createDateGallerySubscriber,
  UnsubscribeFunction,
} from '@uiloos/core';
import { EventData, ariaLabelForEvent } from '../../../events';
import { emptyImage, yiq, getMinutesSinceStart } from '../../../utils';
import { timeFormatter } from '../../../../formatters';
import { START_HOUR, WIDTH } from '../../config';

@Component({
  selector: 'day-event',
  templateUrl: './day-event.component.html',
  styleUrl: './day-event.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class DayEventComponent implements OnInit, OnDestroy {
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

  @Input() date!: Date;
  @Input() dateGallery!: DateGallery<EventData>;
  @Input() event!: DateGalleryEvent<EventData>;
  @Input() gridRow!: string;

  @Output() click = new EventEmitter<void>();

  public yiq: typeof yiq;
  public ariaLabelForEvent: typeof ariaLabelForEvent;

  public title = '';
  public time = '';
  public gridColumn = '';
  public showStartTime = false;
  public showEndTime = false;

  public timeFormatter: Intl.DateTimeFormat;

  constructor(private viewContainerRef: ViewContainerRef) {
    this.yiq = yiq;
    this.ariaLabelForEvent = ariaLabelForEvent;
    this.timeFormatter = timeFormatter;
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

  @ViewChild('eventRef') eventRef!: ElementRef<HTMLLinkElement>;
  @ViewChild('startDragRef') startDragRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('endDragRef') endDragRef!: ElementRef<HTMLSpanElement>;

  public startDraggable = true;
  public endDraggable = true;

  public dragData = {
    xAtDragStart: 0,
    dragStartTime: 0,
    dragEndTime: 0,
  };

  // When the drag starts store information about which event is dragged
  onDragStart(e: DragEvent) {
    e.stopPropagation();

    // Store what the mouse position was at the start of the drag.
    // Used to calulate how many minutes the user wants the event
    // to move.
    this.dragData.xAtDragStart = e.clientX;

    // Set store the original start and end time for when
    // the dragging began. This way we always know the
    // original times even after we "move" the event.
    this.dragData.dragStartTime = new Date(this.event.startDate).getTime();
    this.dragData.dragEndTime = new Date(this.event.endDate).getTime();

    if (e.dataTransfer) {
      // Set the drag image to an empty image. Because we are
      // going to continuously "move" the event we do not need
      // a "ghost".
      e.dataTransfer.setDragImage(emptyImage, 0, 0);
    }
  }

  // When the the event is dragged alter the time period of the vent.
  onDrag(e: DragEvent) {
    e.stopPropagation();

    // Sometimes the clientX is suddenly zero on drag end,
    // do nothing if this is the case. Otherwise the event
    // will suddenly jump to the previous day
    if (e.clientX === 0) {
      return;
    }

    // The number of minutes moved is the amount of pixels away
    // the cursor (clientX) is from the clientX at the start of
    // the drag start.
    const minutesMoved = e.clientX - this.dragData.xAtDragStart;

    // Move by an increment of 5 minutes, to create a snap effect
    if (minutesMoved % 5 === 0) {
      // Date constructor wants milliseconds since 1970
      const msMoved = minutesMoved * 60 * 1000;

      // Note: moving the event will cause the entire DOM to be ripped
      // to shreds and be rebuilt. So the 5 minute snap effect is
      // also a performance boost.

      if (e.target === this.eventRef.nativeElement) {
        // Move both start and end times with the same values
        // so the duration of the event stays the same.
        this.event.move({
          startDate: new Date(this.dragData.dragStartTime + msMoved),
          endDate: new Date(this.dragData.dragEndTime + msMoved),
        });
      } else if (e.target === this.startDragRef.nativeElement) {
        // Move only the start time
        this.event.move({
          startDate: new Date(this.dragData.dragStartTime + msMoved),
          endDate: this.event.endDate,
        });
      } else {
        // Move only the end time
        this.event.move({
          startDate: this.event.startDate,
          endDate: new Date(this.dragData.dragEndTime + msMoved),
        });
      }
    }
  }

  sync() {
    const dayDate = this.dateGallery.firstFrame.anchorDate;

    if (this.event.spansMultipleDays) {
      if (this.dateGallery.isSameDay(this.event.startDate, dayDate)) {
        // When the event starts on this day, make it span the
        // entire day, as we know it does not end on this day.
        const start = getMinutesSinceStart(this.event.startDate, START_HOUR);
        this.gridColumn = `${start + 1} / ${WIDTH}`;

        // No end time indicator as it is on another day
        this.endDraggable = false;

        // Show start time only on first day
        this.showStartTime = true;
      } else if (this.dateGallery.isSameDay(this.event.endDate, dayDate)) {
        // When the event ends on this day start it at midnight, since
        // we know it started on a previous day.
        const end = getMinutesSinceStart(this.event.endDate, START_HOUR);
        this.gridColumn = `1 / ${end + 2}`;

        // No start time drag indicator as it is on another day
        this.startDraggable = false;

        // Show end time only on last day
        this.showEndTime = true;
      } else {
        // When the event is during this whole day
        this.gridColumn = `1 / ${WIDTH}`;

        // No start / end drag indicator as it is on another day
        this.startDraggable = false;
        this.endDraggable = false;
      }
    } else {
      // The event is contained within this day.

      const start = getMinutesSinceStart(this.event.startDate, START_HOUR);
      const end = getMinutesSinceStart(this.event.endDate, START_HOUR);

      this.gridColumn = `${start + 1} / ${end + 1}`;

      // When fully in this day show both times
      this.showStartTime = true;
      this.showEndTime = true;
    }
  }

  onClick(e: Event) {
    e.stopPropagation();
    this.click.emit();
  }
}

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
import { timeFormatter } from '../../../../formatters';
import { START_HOUR, HEIGHT } from '../../config';
import { emptyImage, yiq, getMinutesSinceStart } from '../../../utils';

@Component({
  selector: 'week-event',
  templateUrl: './week-event.component.html',
  styleUrl: './week-event.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class WeekEventComponent implements OnInit, OnDestroy, AfterViewInit {
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
  @Input() gridColumn!: string;

  @Output() click = new EventEmitter<void>();

  public yiq: typeof yiq;
  public ariaLabelForEvent: typeof ariaLabelForEvent;

  public title = '';
  public time = '';
  public gridRow = '';
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

  ngAfterViewInit(): void {
    /*
      Warning dirty hack: 

      In the `WeekCalendar` we render a `DayGrid` which contains the `WeekEvent`
      components, whenever a `WeekEvent` component is dragged over a `DayGrid`
      it is moved to that day, the code to actually move is here in 
      `WeekEvent`'s `onDrag` in the `hoveredDayEl` logic.

      This causes Angular to re-render and since the `WeekEvent` is no longer 
      the child of his old `DayGrid` it is removed from the DOM and re-created.

      But this causes a problem for us: if we used Angular `on:drag`, the 
      dragging stops. When an element is removed Angular no longer sends 
      dragging events. This makes sense since the element from Angular 
      point of view does not exist any longer. This is not what we want, 
      we want to keep dragging the element!

      Luckily for us the `ondrag` from JS does not care if an element is 
      no longer in the DOM.
      
      So we manually keep it in memory by setting an `ondrag` on the element 
      behind Angular's back, and cleaning it up manually. This way the 
      element will stay in memory, due to us keeping a reference to it.
    */
    this.eventRef.nativeElement.ondrag = (e) => {
      this.onDrag(e);
    };

    this.eventRef.nativeElement.ondragend = (e) => {
      if (this.eventRef.nativeElement) {
        this.eventRef.nativeElement.ondrag = null;
        this.eventRef.nativeElement.ondragend = null;
      }
    };
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
    yAtDragStart: 0,
    dragStartTime: 0,
    dragEndTime: 0,
    mode: '',
    draggedEvent: this.event,
  };

  // When the drag starts store information about which event is dragged
  onDragStart(e: DragEvent) {
    e.stopPropagation();

    // Store what the mouse position was at the start of the drag.
    // Used to calulate how many minutes the user wants the event
    // to move.
    this.dragData.yAtDragStart = e.clientY;

    // Set store the original start and end time for when
    // the dragging began. This way we always know the
    // original times even after we "move" the event.
    this.dragData.dragStartTime = new Date(this.event.startDate).getTime();
    this.dragData.dragEndTime = new Date(this.event.endDate).getTime();

    if (e.target === this.eventRef.nativeElement) {
      this.dragData.mode = 'event';
    } else if (e.target === this.startDragRef.nativeElement) {
      this.dragData.mode = 'start';
    } else {
      this.dragData.mode = 'end';
    }

    this.dragData.draggedEvent = this.event;

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

    // Only do something on drag if we are the event that is
    // being dragged
    if (this.dragData.draggedEvent !== this.event) {
      return;
    }

    // Sometimes the clientX is suddenly zero on drag end,
    // do nothing if this is the case. Otherwise the event
    // will suddenly jump to the previous day
    if (e.clientX === 0) {
      return;
    }

    // The number of minutes moved is the amount of pixels away
    // the cursor (clientY) is from the clientY at the start of
    // the drag start.
    const minutesMoved = e.clientY - this.dragData.yAtDragStart;

    // Find the dayEl element the cursor is currently hovering
    // over, if it has found one the date of the event must
    // be changed.
    const hoveredDayEl = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((element) => {
        return element.classList.contains('calendar-week-day-grid');
      });

    // The user might mouse out of the calendar, in that case default
    // to the current startDate
    let movedToDate = this.event.startDate;
    if (hoveredDayEl && hoveredDayEl instanceof HTMLElement) {
      const date = hoveredDayEl.dataset['date'] ?? '0';

      movedToDate = new Date(parseInt(date, 10));
    }

    // Move by an increment of 5 minutes, to create a snap effect
    if (
      minutesMoved % 5 === 0 ||
      !this.dateGallery.isSameDay(movedToDate, this.event.startDate)
    ) {
      // Date constructor wants milliseconds since 1970
      const msMoved = minutesMoved * 60 * 1000;

      // Note: moving the event will cause the entire DOM to be ripped
      // to shreds and be rebuilt. So the 5 minute snap effect is
      // also a performance boost.

      if (this.dragData.mode === 'event') {
        const duration =
          this.dragData.dragEndTime - this.dragData.dragStartTime;

        // First update to the new start time
        const startDate = new Date(this.dragData.dragStartTime + msMoved);

        /* 
          Second update the start date.
          
          We do this via a call to `setFullYear` with all date parts. 
          Setting them in separate calls like this:
          
          startDate.setFullYear(movedToDate.getFullYear());
          startDate.setMonth(movedToDate.getMonth());
          startDate.setDate(movedToDate.getDate());

          Could cause a very nasty bug were it could set the date to a non 
          existing date. But only for very few dates were the size of the 
          month differs from the month the date is moved into.
          
          The bug can be triggered like so:

          const d = new Date(2024, 30, 1); // 1/30/2024 - Feb 30th 2024
          d.setFullYear(2025) // Date is now 1/30/2025
          d.setMonth(2); // Date tries to be 2/30/2025, which doesn't exist, and rolls over to 3/1/2025
          d.setDate(15); // Date is now 3/15/2025 instead of 2/15/2025 as expected

          The above I credit to Marc Hughes see: https://github.com/Simon-Initiative/oli-torus/pull/4614
        */
        startDate.setFullYear(
          movedToDate.getFullYear(),
          movedToDate.getMonth(),
          movedToDate.getDate(),
        );

        // Move both start and end times with the same values
        // so the duration of the event stays the same.
        this.event.move({
          startDate: startDate,
          endDate: new Date(startDate.getTime() + duration),
        });
      } else if (this.dragData.mode === 'start') {
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
    /*
    An event that spans multiple days is rendered once in each
    day the event occurs.

    On dates that match the startDate and endDate we make draggable.
  */
    if (this.event.spansMultipleDays) {
      if (this.dateGallery.isSameDay(this.event.startDate, this.date)) {
        // When the event starts on this day, make it span the
        // entire day, as we know it does not end on this day.
        const start = getMinutesSinceStart(this.event.startDate, START_HOUR);
        this.gridRow = `${start + 1} / ${HEIGHT}`;

        // No end time indicator as it is on another day
        this.endDraggable = false;

        // Show start time only on first day
        this.showStartTime = true;
      } else if (this.dateGallery.isSameDay(this.event.endDate, this.date)) {
        // When the event ends on this day start it at midnight, since
        // we know it started on a previous day.
        const end = getMinutesSinceStart(this.event.endDate, START_HOUR);

        this.gridRow = `1 / ${end + 2}`;

        // No start time drag indicator as it is on another day
        this.startDraggable = false;

        // Show end time only on last day
        this.showEndTime = true;
      } else {
        // When the event is during this whole day take up all space
        this.gridRow = `1 / ${HEIGHT}`;

        // No start / end drag indicator as it is on another day
        this.startDraggable = false;
        this.endDraggable = false;
      }
    } else {
      // The event is contained within this day.

      const start = getMinutesSinceStart(this.event.startDate, START_HOUR);
      const end = getMinutesSinceStart(this.event.endDate, START_HOUR);

      this.gridRow = `${start + 1} / ${end + 1}`;

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

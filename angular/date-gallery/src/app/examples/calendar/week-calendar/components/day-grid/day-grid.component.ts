import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { DateGalleryDate } from '@uiloos/core';
import { EventData } from '../../../events';

@Component({
  selector: 'day-grid',
  templateUrl: './day-grid.component.html',
  styleUrl: './day-grid.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class DayGridComponent implements OnInit {
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
  @Input() gridColumn!: number;

  @Output() openNewEventForm = new EventEmitter<Date>();

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
  }

  public onClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
      // To determine the minute we look to where the user
      // clicked in the day cell. Remember: the day cell
      // is {HEIGHT}px in height, one pixel per minute.

      const rect = event.target.getBoundingClientRect();
      const distanceInMinutes = event.clientY - rect.top;

      const hour = Math.floor(distanceInMinutes / 60);

      let minute = Math.round(distanceInMinutes % 60);
      // Round to closest 5 minutes
      minute = Math.round(minute / 5) * 5;

      const startDate = new Date(this.date);
      startDate.setHours(hour, minute);
      this.openNewEventForm.emit(startDate);
    }
  }

  public dateTrackBy(index: number, dateObj: DateGalleryDate<EventData>) {
    return dateObj.date.toISOString();
  }
}

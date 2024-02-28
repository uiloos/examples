import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  OnInit,
  ViewContainerRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { timeFormatter } from 'src/app/examples/formatters';
import { EventData } from '../../../events';
import { START_HOUR, END_HOUR } from '../../config';

type Entry = {
  time: string;
  column: number;
  date: Date;
};

@Component({
  selector: 'hour-indicators',
  templateUrl: './hour-indicators.component.html',
  styleUrl: './hour-indicators.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class HourIndicatorsComponent implements OnInit {
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

  public timeFormatter: Intl.DateTimeFormat;

  @Input() dateGallery!: DateGallery<EventData>;
  @Input() rows!: string;
  @Output() openNewEventForm = new EventEmitter<Date>();

  public times: Entry[] = [];

  constructor(private viewContainerRef: ViewContainerRef) {
    this.timeFormatter = timeFormatter;
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);

    for (let i = START_HOUR; i < END_HOUR + 1; i++) {
      const column = (i - START_HOUR) * 60 + 1;

      const date = new Date(this.dateGallery.firstFrame.anchorDate);
      date.setHours(i, 0, 0, 0);

      const time = timeFormatter.format(date);

      this.times.push({ time, column, date });
    }
  }

  public onClick(event: MouseEvent, date: Date) {
    if (event.target instanceof HTMLElement) {
      // To determine the minute we look to where the user
      // clicked in the hour cell. Remember: the hour cell
      // is 60px in height, one pixel per minute.
      const rect = event.target.getBoundingClientRect();
      const distanceInMinutes = event.clientX - rect.left;

      // Round to closest 5 minutes
      const minute = Math.round(distanceInMinutes / 5) * 5;

      const eventDate = new Date(date);
      eventDate.setHours(date.getHours(), minute);

      this.openNewEventForm.emit(eventDate);
    }
  }

  getStyle(entry: Entry) {
    return {
      gridColumn: `${entry.column} / ${entry.column + 60}`,
      gridRow: `1 / ${this.rows}`,
    };
  }
}

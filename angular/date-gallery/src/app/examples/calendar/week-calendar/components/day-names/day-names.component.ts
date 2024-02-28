import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { DateGallery, DateGalleryDate } from '@uiloos/core';
import { EventData } from '../../../events';
import { weekDayFormatter } from 'src/app/examples/formatters';

@Component({
  selector: 'day-names',
  templateUrl: './day-names.component.html',
  styleUrl: './day-names.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class DayNamesComponent implements OnInit {
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

  public weekDayFormatter: Intl.DateTimeFormat;

  constructor(private viewContainerRef: ViewContainerRef) {
    this.weekDayFormatter = weekDayFormatter;
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
  }

  onClick(e: Event, date: Date) {
    e.preventDefault();

    this.dateGallery.changeConfig({
      initialDate: date,
      mode: 'day',
      numberOfFrames: 1,
    });
  }

  public dateTrackBy(index: number, dateObj: DateGalleryDate<EventData>) {
    return dateObj.date.toISOString();
  }
}

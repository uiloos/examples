import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  OnInit,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { timeFormatter } from 'src/app/examples/formatters';
import { START_HOUR, END_HOUR } from '../../config';

type Entry = {
  time: string;
  gridRow: string;
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
  public times: Entry[] = [];

  constructor(private viewContainerRef: ViewContainerRef) {
    this.timeFormatter = timeFormatter;
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);

    for (let i = START_HOUR; i < END_HOUR + 1; i++) {
      const row = (i - START_HOUR) * 60 + 3;
      const gridRow = `${row} / ${row + 60}`;

      const date = new Date();
      date.setHours(i, 0, 0, 0);

      const time = timeFormatter.format(date);

      this.times.push({ time, gridRow });
    }
  }
}

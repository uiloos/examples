import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { EventData } from '../events';
import { monthAndYearFormatter } from '../../formatters';

@Component({
  selector: 'week-calendar-title',
  template: ` {{ format() }} `,
  standalone: true,
  imports: [CommonModule],
})
export class WeekCalendarTitleComponent {
  @Input() dateGallery!: DateGallery<EventData>;

  format() {
    return monthAndYearFormatter.format(this.dateGallery.firstFrame.anchorDate);
  }
}

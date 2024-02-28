import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { EventData } from '../events';
import { dateFormatter } from '../../formatters';

@Component({
  selector: 'day-calendar-title',
  template: ` {{ format() }} `,
  standalone: true,
  imports: [CommonModule],
})
export class DayCalendarTitleComponent {
  @Input() dateGallery!: DateGallery<EventData>;

  format() {
    return dateFormatter.format(this.dateGallery.firstFrame.anchorDate);
  }
}

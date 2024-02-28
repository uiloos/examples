import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { EventData } from '../events';
import { yearFormatter } from '../../formatters';

@Component({
  selector: 'year-calendar-title',
  template: ` {{ format() }} `,
  standalone: true,
  imports: [CommonModule],
})
export class YearCalendarTitleComponent {
  @Input() dateGallery!: DateGallery<EventData>;

  format() {
    return yearFormatter.format(this.dateGallery.firstFrame.anchorDate);
  }
}

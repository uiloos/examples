import { Component, Input } from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { monthFormatter } from '../../formatters';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'month-select',
  templateUrl: './month-select.component.html',
  styleUrls: ['./month-select.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class MonthSelectComponent {
  @Input() dateGallery!: DateGallery<unknown>;

  public months = [...Array<number>(12).keys()];

  onMonthChanged(e: Event) {
    if (e.target instanceof HTMLSelectElement) {
      const newMonth = parseInt(e.target.value, 10);

      const date = new Date(this.dateGallery.firstFrame.anchorDate);
      date.setMonth(newMonth);

      this.dateGallery.changeConfig({ initialDate: date });
    }
  }

  formatMonth(month: number) {
    return monthFormatter.format(new Date(2000, month, 1));
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateGallery } from '@uiloos/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'year-input',
  templateUrl: './year-input.component.html',
  styleUrls: ['./year-input.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class YearInputComponent implements OnChanges {
  @Input() dateGallery!: DateGallery<unknown>;
  @Input() year!: number;

  // Whenever the year changes update the year, happens
  // when user uses next and previous buttons.
  ngOnChanges(changes: SimpleChanges) {
    const yearChanges = changes['year'];

    if (yearChanges) {
      this.year = yearChanges.currentValue as number;
    }
  }

  onYearInputChanged(event: FocusEvent) {
    event.stopPropagation();

    if (event.target instanceof HTMLInputElement) {
      let newYear = parseInt(event.target.value, 10);

      if (isNaN(newYear)) {
        newYear = new Date().getFullYear();
      }

      this.year = newYear;

      const date = new Date(
        this.year,
        this.dateGallery.firstFrame.anchorDate.getMonth(),
        this.dateGallery.firstFrame.anchorDate.getDate(),
      );

      this.dateGallery.changeConfig({ initialDate: date });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DaterangePickerComponent } from '../../daterange-picker/daterange-picker.component';
import { DateGallery, DateGalleryEvent } from '@uiloos/core';
import { EventData, formatDateForInput, eventId } from '../events';
import { MyDialogComponent } from '../../my-dialog/my-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DaterangePickerComponent,
    MyDialogComponent,
  ],
})
export class EventFormComponent implements OnInit {
  @Input() dateGallery!: DateGallery<EventData>;
  @Input() formEvent: DateGalleryEvent<EventData> | undefined = undefined;
  @Input() formDate: Date | undefined = undefined;

  @Output() close = new EventEmitter<void>();

  // Better to use one of Angulars form abstactions or a form library

  public title = '';
  public titleError = '';

  public description = '';
  public descriptionError = '';

  public startDate = '';
  public endDate = '';
  public rangeValid = false;
  public color = '#000000';
  public colorError = '';

  ngOnInit(): void {
    if (this.formEvent) {
      this.title = this.formEvent.data.title;
      this.description = this.formEvent.data.description;
      this.startDate = formatDateForInput(this.formEvent.startDate);
      this.endDate = formatDateForInput(this.formEvent.endDate);
      this.color = this.formEvent.data.color;
    } else if (this.formDate) {
      this.startDate = formatDateForInput(this.formDate);

      const date = new Date(this.formDate);
      date.setHours(this.formDate.getHours() + 1, this.formDate.getMinutes());

      this.endDate = formatDateForInput(date);
    }

    if (this.formEvent) {
    } else if (this.formDate) {
    }

    if (this.formEvent) {
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();

    let valid = true;

    if (this.title === '') {
      this.titleError = 'Title is required';
      valid = false;
    } else {
      this.titleError = '';
    }

    if (this.description === '') {
      this.descriptionError = 'Description is required';
      valid = false;
    } else {
      this.descriptionError = '';
    }

    if (this.color === '') {
      this.colorError = 'Color is required';
      valid = false;
    } else {
      this.colorError = '';
    }

    if (!this.rangeValid || !valid) {
      return;
    }

    if (this.formEvent === undefined) {
      // Inform the dateGallery of the new event
      this.dateGallery.addEvent({
        data: {
          id: eventId(),
          title: this.title,
          description: this.description,
          color: this.color,
        },
        startDate: this.startDate,
        endDate: this.endDate,
      });
    } else {
      // Inform the dateGallery that the event has changed.

      // First update the data object of the event, to whatever
      // the user filled in.
      this.formEvent.changeData({
        id: this.formEvent.data.id,
        title: this.title,
        description: this.description,
        color: this.color,
      });

      // Then tell the DateGallery that the event has actually moved
      this.formEvent.move({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }

    this.closeDialog();
  }

  rangeValidChanged(value: boolean) {
    this.rangeValid = value;
  }

  deleteButtonClicked() {
    if (this.formEvent) {
      this.formEvent.remove();
      this.closeDialog();
    }
  }

  closeDialog() {
    this.close.emit();
  }
}

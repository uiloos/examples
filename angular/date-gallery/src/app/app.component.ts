import { Component } from '@angular/core';

import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';

import { DatepickerExampleComponent } from './examples/datepicker/datepicker-example/datepicker-example.component';
import { DaterangePickerExampleComponent } from './examples/daterange-picker/daterange-picker-example/daterange-picker-example.component';
import { CalendarComponent } from './examples/calendar/calendar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    TabsComponent,
    TabComponent,
    DatepickerExampleComponent,
    DaterangePickerExampleComponent,
    CalendarComponent,
  ],
})
export class AppComponent {}

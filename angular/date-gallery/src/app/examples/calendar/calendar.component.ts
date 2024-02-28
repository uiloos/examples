import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActiveList,
  DateGallery,
  DateGalleryMode,
  DateGalleryEvent,
  DateGalleryConfig,
  createDateGallerySubscriber,
} from '@uiloos/core';
import { generateEvents, EventData } from './events';
import { isValid } from 'date-fns';
import { isoFormatter } from '../formatters';
import { YearCalendarTitleComponent } from './year-calendar/year-calendar-title.component';
import { MonthCalendarTitleComponent } from './month-calendar/month-calendar-title.component';
import { WeekCalendarTitleComponent } from './week-calendar/week-calendar-title.component';
import { DayCalendarTitleComponent } from './day-calendar/day-calendar-title.component';
import { YearCalendarComponent } from './year-calendar/year-calendar.component';
import { EventFormComponent } from './event-form/event-form.component';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';
import { WeekCalendarComponent } from './week-calendar/week-calendar.component';
import { DayCalendarComponent } from './day-calendar/day-calendar.component';

type Mode = {
  mode: DateGalleryMode;
  label: string;
};

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    YearCalendarTitleComponent,
    MonthCalendarTitleComponent,
    WeekCalendarTitleComponent,
    DayCalendarTitleComponent,
    YearCalendarComponent,
    EventFormComponent,
    MonthCalendarComponent,
    WeekCalendarComponent,
    DayCalendarComponent,
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  public showForm = false;
  public formEvent: DateGalleryEvent<EventData> | undefined = undefined;
  public formDate: Date | undefined = undefined;

  public dateGallery!: DateGallery<EventData>;
  public modeSegmentedButton!: ActiveList<Mode>;

  ngOnInit(): void {
    const { mode, numberOfFrames, initialDate } = this.readConfigFromUrl();

    const self = this;
    this.dateGallery = new DateGallery(
      {
        mode,
        numberOfFrames,
        initialDate,
        events: generateEvents(),
      },
      createDateGallerySubscriber({
        onConfigChanged() {
          self.syncSearchParams();
        },
        onFrameChanged() {
          self.syncSearchParams();
        },
      }),
    );

    const modeOptions: Mode[] = [
      { mode: 'month', label: 'Year' },
      { mode: 'month-six-weeks', label: 'Month' },
      { mode: 'week', label: 'Week' },
      { mode: 'day', label: 'Day' },
    ];

    this.modeSegmentedButton = new ActiveList({
      contents: modeOptions,
      activeIndexes: modeOptions.findIndex((option) => option.mode === mode),
    });

    window.addEventListener('popstate', this.syncFromUrl);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.syncFromUrl);
    this.dateGallery.unsubscribeAll();
  }

  syncSearchParams() {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', this.dateGallery.mode);
    url.searchParams.set(
      'initialDate',
      isoFormatter.format(this.dateGallery.firstFrame.anchorDate),
    );

    // Only push if the url has actually changed,
    // otherwise it will push duplicates.
    if (url.href !== window.location.href) {
      window.history.pushState({}, '', url);
      this.activateMode(this.dateGallery.mode);
    }
  }

  // Activates a mode and syncs both the dateGallery and modeSegmentedButton (ActiveList)
  // This way no matter how the mode changes, either from inside the dateGallery subscriber
  // or via a button click on the mode segemented button they will always be in sync.
  activateMode(mode: DateGalleryMode) {
    // Step 1: sync with the segmented button
    this.modeSegmentedButton.activateByPredicate((data) => {
      return data.value.mode === mode;
    });

    // Step 2: sync with the DateGallery

    // When the 'mode' is month it means 'year' has been selected
    // and we show 12 month calenders side by side.
    if (mode === 'month') {
      // Anchor date to january first, otherwise the 'year' will start
      // at the current month.
      const initialDate = new Date(this.dateGallery.firstFrame.anchorDate);
      initialDate.setMonth(0);
      initialDate.setDate(1);

      this.dateGallery.changeConfig({
        mode,
        numberOfFrames: 12,
        initialDate,
      });
    } else {
      this.dateGallery.changeConfig({ mode, numberOfFrames: 1 });
    }
  }

  openNewEventForm(date = new Date()) {
    this.showForm = true;
    this.formDate = date;
    this.formEvent = undefined;
  }

  openEditEventForm(event: DateGalleryEvent<EventData>) {
    this.showForm = true;
    this.formDate = undefined;
    this.formEvent = event;
  }

  closeEventForm() {
    this.showForm = false;
    this.formEvent = undefined;
  }

  readConfigFromUrl(): DateGalleryConfig<EventData> {
    const url = new URL(window.location.href);

    let mode = url.searchParams.get('mode') ?? 'month';

    if (
      !['month', 'month-six-weeks', 'week', 'day'].includes(mode.toLowerCase())
    ) {
      mode = 'month';
    }

    const typedMode = mode as DateGalleryMode;

    const numberOfFrames = mode === 'month' ? 12 : 1;

    let initialDate = url.searchParams.get('initialDate') ?? new Date();
    initialDate = new Date(initialDate);

    if (!isValid(initialDate)) {
      initialDate = new Date();
    }

    return {
      mode: typedMode,
      numberOfFrames,
      initialDate,
    };
  }

  syncFromUrl = () => {
    const config = this.readConfigFromUrl();

    this.dateGallery.changeConfig(config);

    this.modeSegmentedButton.activateByPredicate((data) => {
      return data.value.mode === config.mode;
    });
  };
}

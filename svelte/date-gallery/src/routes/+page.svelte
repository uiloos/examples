<Tabs>
  <Tab name="Calendar" href="#calendar">
    <Calendar />

    <div class="description">
      <p>
        The example above shows a fully fledged calendar that supports year,
        month week and day modes.
      </p>
      <p>
        It also supports drag and drop for the events, plus resizing the
        events on the day and week calendar.
      </p>
      <p>
        The various calendars modes use CSS grids extensively to create the
        layout for each mode.
      </p>
    </div>
  </Tab>

  <Tab name="Datepicker" href="#datepicker">
	  <DatepickerExample />
  </Tab>

  <Tab name="DateRangePicker" href="#daterangepicker">
	  <DateRangePickerExample />
  </Tab>
</Tabs>

<script lang="ts"> 
  import Tabs from "../Tabs/Tabs.svelte";
  import Tab from "..//Tabs/Tab.svelte";

  import Calendar from "../examples/Calendar/Calendar.svelte";
  import DatepickerExample from "../examples/Datepicker/DatepickerExample.svelte";
  import DateRangePickerExample from "../examples/DateRangePicker/DateRangePickerExample.svelte";
</script>

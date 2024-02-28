{yearFormatter.format(dateGallery.firstFrame.anchorDate)}

<script lang="ts">
  import type { DateGallery } from "@uiloos/core";
  import { yearFormatter } from "../../formatters";
  import type { EventData } from "../events";

  export let dateGallery: DateGallery<EventData>;
</script>
<ol>
  <li>
    <button on:click={() => onCarClicked('ford')}>Ford</button>
  </li>
  <li>
    <button on:click={() => onCarClicked('audi')}>Audi</button>
  </li>
  <li>
    <button on:click={() => onCarClicked('toyota')}>Toyota</button>
  </li>
</ol>

<script lang="ts">
import type { ModalComponent } from "../modal/types";
import type { ViewChannelView } from "@uiloos/core";

type CarModalResult = "ford" | "audi" | "toyota";

export let view: ViewChannelView<unknown, CarModalResult>;

function onCarClicked(car: CarModalResult) {
  view.dismiss(car);
}
</script>
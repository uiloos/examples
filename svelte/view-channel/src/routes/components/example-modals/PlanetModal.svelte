<small>{ data.plea }</small>

<ol>
  <li>
    <button on:click={() => destroy('earth')}>Earth</button>
  </li>
  <li>
    <button on:click={() => destroy('mars')}>Mars</button>
  </li>
  <li>
    <button on:click={() => destroy('venus')}>Venus</button>
  </li>
</ol>

<script lang="ts">
import type { ViewChannelView } from "@uiloos/core";
import { confirmDialog } from "../confirm-dialog/confirm-dialog-service";

type PlanetModalResult = "earth" | "mars" | "venus";

type PlanetModalComponentData = {
  plea: string;
};

export let view: ViewChannelView<unknown, PlanetModalResult>;
export let data: PlanetModalComponentData;

async function destroy(planet: PlanetModalResult) {
  const confirmation = await confirmDialog(
    `Are you sure you want to destroy ${planet}`
  );

  if (confirmation) {
    view.dismiss(planet);
  }
}
</script>
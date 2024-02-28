<dialog bind:this={dialog} on:click={closeDialog} on:keydown={onKeyDown}>
  <slot />
</dialog>

<script lang="ts">
  import {onMount} from 'svelte';

  let dialog: HTMLDialogElement | null = null;
  export let onKeyDown: (e: KeyboardEvent) => void = () => undefined;
  export let onClose: () => void;

  onMount(() => {
    if (dialog) {
      dialog.showModal();
    }
  });

  function closeDialog(event: MouseEvent) {
    if (event.target && event.target instanceof HTMLElement && event.target.nodeName === "DIALOG") {
      if (dialog) {
        dialog.close();
      }

      onClose();
    }
}
</script>

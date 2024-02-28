<script lang="ts">
  import SegmentedButton from './SegmentedButton.svelte';

  // State for the SegmentedButton example
  let textAlign: 'left' | 'center' | 'right' = 'center';
</script>

<div class="segment-example">
  <SegmentedButton
    buttons={[
      {
        label: 'Left',
        onClick() {
          textAlign = 'left';
        },
      },
      {
        label: 'Center',
        onClick() {
          textAlign = 'center';
        },
        active: true,
      },
      {
        label: 'Right',
        onClick() {
          textAlign = 'right';
        },
      },
    ]}
  />

  <p style:text-align={textAlign}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi
    tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem
    nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae
    neque!
  </p>
</div>
<div class="description">
  <p>
    A segmented button only allows one item to be active at the same time, which
    is a perfect usecase for the ActiveList.
  </p>
</div>

<style>
  .segment-example {
    margin-bottom: 16px;
  }

  .segment-example p {
    padding: 0 64px;
    margin: 16px 0;
    max-width: 512px;
  }
</style>

<script lang="ts">
  import Tabs from '../examples/Tabs/Tabs.svelte';
  import Tab from '../examples/Tabs/Tab.svelte';

  import ClassicCarousel from '../examples/ClassicCarousel/ClassicCarousel.svelte';
  import SnapCarousel from '../examples/SnapCarousel/SnapCarousel.svelte';
  import PeekAheadCarousel from '../examples/PeekAheadCarousel/PeekAheadCarousel.svelte';
  import AccordionExample from '../examples/Accordion/AccordionExample.svelte';
  import SegmentedButtonExample from '../examples/SegmentedButton/SegmentedButtonExample.svelte';
  import TodoList from '../examples/TodoList/TodoList.svelte';
  import Gallery from '../examples/Gallery/Gallery.svelte';
  import TimelineExample from '../examples/Timeline/TimelineExample.svelte';
  import CondimentSelectorExample from '../examples/Selector/CondimentSelectorExample.svelte';

  import { owls } from '../owls';
</script>

<Tabs>
  <Tab name="Snap carousel" href="#snap-carousel">
    <SnapCarousel slides={owls} />

    <div class="description">
      <p>
        The example above shows a CSS based snap carousel, it has been enhanced
        by "uiloos" to move to the next slide by itself via the ActiveList
        autoPlay feature.
      </p>

      <p>
        When the user interacts with the carousel the autoPlay is disabled and
        the user assumes control of the carousel.
      </p>

      <p>
        When you disabled JavaScript carousel will still work, but it will not
        autoPlay.
      </p>
    </div>
  </Tab>

  <Tab name="Peek carousel" href="#peek-carousel">
    <PeekAheadCarousel slides={owls} />

    <div class="description">
      <p>
        This is a variant of the "Snap Carousel" example which shows the user a
        little bit of the previous and next slides.
      </p>

      <p>
        When the user interacts with the carousel the autoPlay is disabled and
        the user assumes control of the carousel.
      </p>

      <p>
        When you disabled JavaScript carousel will still work, but it will not
        autoPlay.
      </p>
    </div>
  </Tab>

  <Tab name="Classic carousel" href="#classic-carousel">
    <ClassicCarousel slides={owls} />

    <div class="description">
      <p>
        This example shows a classic carousel, it is classic because it does not
        use modern CSS (with snap points) to create the carousel.
      </p>

      <p>
        Instead it uses JavaScript to create the carousel, which is why it does
        not work when JavaScript is disabled.
      </p>

      <p>
        The user can either use the chevron buttons to navigate between the
        slides, or the user can click on the progress indicators. Once the user
        takes control of the carousel it will stop auto playing.
      </p>
    </div>
  </Tab>

  <Tab name="Accordion" href="#accordion">
    <AccordionExample />
  </Tab>

  <Tab name="Segmented button" href="#segmented-button">
    <SegmentedButtonExample />
  </Tab>

  <Tab name="Todo list" href="#todo-list">
    <TodoList />

    <div class="description">
      <p>
        This todo example shows that multiple items can be 'active' at the same
        time in the ActiveList.
      </p>

      <p>
        It also demonstrates how easy it is to move items around in the list.
        Try drag and dropping the todos.
      </p>
    </div>
  </Tab>

  <Tab name="Image gallery" href="#image-gallery">
    <Gallery
      images={owls.map((owl) => ({
        alt: owl.description,
        src: owl.img.src,
      }))}
    />

    <div class="description">
      <p>
        The gallery is popular on websites that have a lot of images to show,
        but do not want to single out a single image.
      </p>
    </div>
  </Tab>

  <Tab name="Timeline" href="#timeline">
    <TimelineExample />
    <div class="description">
      <p>
        The idea behind this example is to show that "uiloos" is aware of the
        position an item has within the ActiveList. "uiloos" can tell you what
        the next item, previous item and what first and last items are.
      </p>

      <p>
        You can then use this information to set different CSS classes for each
        item.
      </p>
    </div>
  </Tab>

  <Tab name="Selector" href="#selector">
    <CondimentSelectorExample />

    <div class="description">
      <p>
        This example shows that via "maxActivationLimit" you can limit the
        amount of content / items that can be active.
      </p>

      <p>
        By setting "maxActivationLimitBehavior" to "ignore" whenever more items
        are activated than the "maxActivationLimit" they are simply ignored.
      </p>
    </div>
  </Tab>
</Tabs>

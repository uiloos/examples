import { Component } from '@angular/core';
import { ClassicCarouselComponent } from './examples/classic-carousel/classic-carousel.component';
import { TabComponent } from './examples/tabs/tab.component';
import { TabsComponent } from './examples/tabs/tabs.component';
import { TimelineExampleComponent } from './examples/timeline/timeline-example.component';
import { owls } from '../owls';
import { SnapCarouselComponent } from './examples/snap-carousel/snap-carousel.component';
import { PeekAheadCarouselComponent } from './examples/peek-ahead-carousel/peek-ahead-carousel.component';
import { AccordionExampleComponent } from './examples/accordion/accordion-example.component';
import { SegmentedButtonExampleComponent } from './examples/segmented-button/segmented-button-example.component';
import { TodoListComponent } from './examples/todo-list/todo-list.component';
import { GalleryComponent } from './examples/gallery/gallery.component';
import { CondimentSelectorExample } from './examples/selector/condiment-selector-example.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    TimelineExampleComponent,
    TabsComponent,
    TabComponent,
    ClassicCarouselComponent,
    SnapCarouselComponent,
    PeekAheadCarouselComponent,
    AccordionExampleComponent,
    SegmentedButtonExampleComponent,
    TodoListComponent,
    GalleryComponent,
    CondimentSelectorExample
  ],
})
export class AppComponent {
  public owls = owls;

  public galleryImages = owls.map((owl) => ({
    alt: owl.description,
    src: owl.img.src,
  }));
}

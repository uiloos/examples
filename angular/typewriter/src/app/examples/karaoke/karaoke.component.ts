import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { Typewriter } from "@uiloos/core";

@Component({
  selector: "karaoke",
  styleUrls: ["./karaoke.component.css"],
  templateUrl: "./karaoke.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KaraokeComponent {
  constructor(private ref: ChangeDetectorRef) {}

  public typewriter = new Typewriter(
    {
      repeat: true,
      repeatDelay: 5000,
      // Created using the Typewriter composer: https://www.uiloos.dev/docs/typewriter/composer/
      actions: [
        { type: "keyboard", cursor: 0, text: "Turn ", delay: 400 },
        { type: "keyboard", cursor: 0, text: "around ", delay: 300 },
        { type: "keyboard", cursor: 0, text: "bright ", delay: 500 },
        { type: "keyboard", cursor: 0, text: "eyes! ", delay: 400 },
        { type: "keyboard", cursor: 0, text: "Every ", delay: 1000 },
        { type: "keyboard", cursor: 0, text: "now ", delay: 400 },
        { type: "keyboard", cursor: 0, text: "and ", delay: 100 },
        { type: "keyboard", cursor: 0, text: "then ", delay: 100 },
        { type: "keyboard", cursor: 0, text: "I ", delay: 100 },
        { type: "keyboard", cursor: 0, text: "fall ", delay: 100 },
        { type: "keyboard", cursor: 0, text: "apart!", delay: 100 }
      ]
    },
    () => {
      // Only update the component when something changes.
      this.ref.markForCheck();
    }
  );
}

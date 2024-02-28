import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { Typewriter } from "@uiloos/core";

@Component({
  selector: "movie",
  styleUrls: ["./movie.component.css"],
  template: `<div id="movie-typewriter">{{ typewriter.text }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MovieComponent {
  constructor(private ref: ChangeDetectorRef) {}

  public typewriter = new Typewriter(
    {
      repeat: true,
      repeatDelay: 10000,
      actions: [
        {
          type: "keyboard",
          cursor: 0,
          text: "This",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "summer",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "experience",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "a",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "film",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "like",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "never",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "before",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: ":",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "Vampires",
          delay: 1000
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "from",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "Venus",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "VII:",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "the",
          delay: 2000
        },
        {
          type: "keyboard",
          cursor: 0,
          text: " ",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: "Quickening",
          delay: 50
        },
        {
          type: "keyboard",
          cursor: 0,
          text: ".",
          delay: 50
        }
      ]
    },
    () => {
      // Only update the component when something changes.
      this.ref.markForCheck();
    }
  );
}

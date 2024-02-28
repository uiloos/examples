import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { typewriterFromSentences } from "@uiloos/core";

@Component({
  selector: "sentences",
  styleUrls: ["./sentences.component.css"],
  templateUrl: "./sentences.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SentencesComponent {
  constructor(private ref: ChangeDetectorRef) {}

  public typewriter = typewriterFromSentences(
    {
      sentences: [
        "Superman is the man of steel",
        "Supergirls real name is Kara Zor-El",
        "Batman is the dark knight",
        "Batmans nemesis is called the Joker",
        "The Flash can run through time",
        "Wonder woman possesses the Lasso of Truth"
      ],
      repeat: true,
      repeatDelay: 2000,
      text: "Wonder woman possesses the Lasso of Truth"
    },
    () => {
      // Only update the component when something changes.
      this.ref.markForCheck();
    }
  );
}

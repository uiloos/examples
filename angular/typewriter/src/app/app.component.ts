import { Component } from "@angular/core";
import { InteractiveComponent } from "./examples/interactive/interactive.component";
import { KaraokeComponent } from "./examples/karaoke/karaoke.component";
import { LullabyComponent } from "./examples/lullaby/lullaby.component";
import { MovieComponent } from "./examples/movie/movie.component";
import { MulticursorComponent } from "./examples/multicursor/multicursor.component";
import { SentencesComponent } from "./examples/sentences/sentences.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [
    SentencesComponent,
    InteractiveComponent,
    KaraokeComponent,
    LullabyComponent,
    MovieComponent,
    MulticursorComponent
  ]
})
export class AppComponent {}

import { Interactive } from "./Interactive/Interactive";
import { Karaoke } from "./Karaoke/Karaoke";
import { Lullaby } from "./Lullaby/Lullaby";
import { Movie } from "./Movie/Movie";
import { Multicursor } from "./Multicursor/Multicursor";
import { Sentences } from "./Sentences/Sentences";

export default function App() {
  return (
    <div className="App">
      <Sentences />
      <Multicursor />
      <Movie />
      <Lullaby />
      <Karaoke />
      <Interactive />
    </div>
  );
}

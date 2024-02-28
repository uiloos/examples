import { useTypewriter } from "@uiloos/react";

import "./Karaoke.css";

export function Karaoke() {
  const typewriter = useTypewriter({
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
  });

  return (
    <div id="karaoke-typewriter">
      <span id="karaoke-typewriter-highlight">{typewriter.text}</span>
      <span id="karaoke-typewriter-regular">
        Turn around bright eyes! Every now and then I fall apart!
      </span>
    </div>
  );
}

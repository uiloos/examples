import { useTypewriterFromSentences } from "@uiloos/react";
import classNames from "classnames";

import "./Sentences.css";

export function Sentences() {
  const typewriter = useTypewriterFromSentences({
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
  });

  return (
    <div id="sentences-typewriter">
      {typewriter.text}
      <span
        className={classNames("cursor", {
          blinking: typewriter.cursors[0].isBlinking
        })}
      />
    </div>
  );
}

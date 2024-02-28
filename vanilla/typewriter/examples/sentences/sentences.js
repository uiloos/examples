const typewriterEl = document.getElementById("sentences-typewriter");

export function sentences() {
  window.uiloosTypewriter.typewriterFromSentences(
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
    (typewriter) => {
      // Assigning via textContent will also clear
      // the previous cursor
      typewriterEl.textContent = typewriter.text;

      const cursorEl = document.createElement("span");
      cursorEl.id = "sentences-typewriter-cursor";
      if (typewriter.cursors[0].isBlinking) {
        cursorEl.classList.add("blinking");
      }
      typewriterEl.append(cursorEl);
    }
  );
}

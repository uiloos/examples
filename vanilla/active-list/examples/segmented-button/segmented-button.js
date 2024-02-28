const segmentEl = document.querySelector(".segment-example");
const segmentsButtonsEl = Array.from(segmentEl.querySelectorAll("button"));

const segmentedButton = new window.uiloosActiveList.ActiveList(
  {
    contents: segmentsButtonsEl,
    active: segmentsButtonsEl.filter((b) => b.classList.contains("active"))
  },
  (segmentedButton) => {
    segmentedButton.contents.forEach((content) => {
      const buttonEl = content.value;

      if (content.isActive) {
        buttonEl.classList.add("active");
      } else {
        buttonEl.classList.remove("active");
      }
    });
  }
);

segmentsButtonsEl.forEach((buttonEl) => {
  const actualOnClick = buttonEl.onclick;

  buttonEl.onclick = (event) => {
    segmentedButton.activate(buttonEl);
    actualOnClick(event);
  };
});

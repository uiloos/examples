const galleryEl = document.querySelector(".gallery-example");
const buttons = Array.from(galleryEl.querySelectorAll("button"));
const selectedEl = galleryEl.querySelector(".gallery-selected");

const gallery = new window.uiloosActiveList.ActiveList(
  {
    contents: buttons,
    active: buttons[0]
  },
  (gallery) => {
    const activeButton = gallery.lastActivated;

    const imgEl = activeButton.querySelector("img");

    selectedEl.innerHTML = "";
    selectedEl.append(imgEl.cloneNode(true));
  }
);

buttons.forEach((button) => {
  button.onclick = () => {
    gallery.activate(button);
  };
});

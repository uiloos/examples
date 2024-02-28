const accordionEl = document.querySelector(".accordion-example");
const detailsEl = Array.from(accordionEl.querySelectorAll("details"));

const accordion = new window.uiloosActiveList.ActiveList(
  {
    contents: detailsEl,
    active: detailsEl.filter((detail) => detail.getAttribute("open") === "open")
  },
  (accordion) => {
    accordion.contents.forEach((content) => {
      const detailEl = content.value;
      detailEl.open = content.isActive;
    });
  }
);

detailsEl.forEach((detailEl) => {
  detailEl.onclick = (event) => {
    // Prevent default opening of details element,
    // and let the subscriber handle this.
    event.preventDefault();

    accordion.activate(detailEl);
  };
});

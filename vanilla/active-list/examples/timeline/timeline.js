const timelineEl = document.querySelector(".timeline");
const timeLineItemsEl = Array.from(
  timelineEl.querySelectorAll(".timeline-item")
);

const timeline = new window.uiloosActiveList.ActiveList(
  {
    contents: timeLineItemsEl,
    activeIndexes: 0
  },
  (timeline) => {
    timeline.contents.forEach((content, index) => {
      timelineEl
        .querySelector(`#timeline-content-${index}`)
        .classList.add("visually-hidden");

      if (content.isActive) {
        content.value.classList.add("current");
      } else {
        content.value.classList.remove("current");
      }

      if (content.isNext) {
        content.value.classList.add("next");
      } else {
        content.value.classList.remove("next");
      }

      if (content.isPrevious) {
        content.value.classList.add("previous");
      } else {
        content.value.classList.remove("previous");
      }

      if (content.hasBeenActiveBefore) {
        content.value.classList.add("seen");
      } else {
        content.value.classList.remove("seen");
      }
    });

    timelineEl
      .querySelector(`#timeline-content-${timeline.lastActivatedIndex}`)
      .classList.remove("visually-hidden");
  }
);

timeLineItemsEl.forEach((liEl, index) => {
  liEl.onclick = () => timeline.activateByIndex(index);
});

timelineEl.querySelectorAll(".timeline-previous").forEach((button) => {
  button.onclick = () => {
    timeline.activatePrevious();
  };
});

timelineEl.querySelectorAll(".timeline-next").forEach((button) => {
  button.onclick = () => {
    timeline.activateNext();
  };
});

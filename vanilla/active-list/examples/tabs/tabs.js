const tabsEl = document.querySelector(".tabs");
const linksEl = Array.from(tabsEl.querySelectorAll(".tab"));
const contentsEl = tabsEl.querySelectorAll(".tab-content");

const links = linksEl.map((link) => new URL(link.href).hash);

const tabs = new window.uiloosActiveList.ActiveList(
  {
    contents: links,
    active: window.location.hash === "" ? links[0] : window.location.hash
  },
  (tabs) => {
    linksEl.forEach((linkEl, index) => {
      if (index === tabs.lastActivatedIndex) {
        linkEl.classList.add("active");
      } else {
        linkEl.classList.remove("active");
      }
    });

    contentsEl.forEach((contentEl, index) => {
      if (index === tabs.lastActivatedIndex) {
        contentEl.classList.remove("visually-hidden");
        contentEl.ariaHidden = false;
      } else {
        contentEl.classList.add("visually-hidden");
        contentEl.ariaHidden = true;
      }
    });
  }
);

linksEl.forEach((linkEl, index) => {
  linkEl.onclick = () => tabs.activateByIndex(index);
});

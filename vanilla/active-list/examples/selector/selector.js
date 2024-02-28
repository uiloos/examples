const selectorExampleEl = document.querySelector(".selector-example");
const condimentsEl = Array.from(
  selectorExampleEl.querySelectorAll(".condiment")
);
const activeCondimentsEl = selectorExampleEl.querySelector(
  "#active-condiments"
);
const condimentsLengthEl = selectorExampleEl.querySelector(
  "#condiments-length"
);
const condimentsCostEl = selectorExampleEl.querySelector("#condiments-cost");

const maxCondimentsMessage = selectorExampleEl.querySelector(
  "#max-condiments-message"
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const condiments = new window.uiloosActiveList.ActiveList(
  {
    contents: condimentsEl,
    active: [],
    // Do not allow for more than three condiments.
    maxActivationLimit: 3,

    // When the limit is reached and more condiments are activated
    // simply ignore them and keep the original three condiments.
    maxActivationLimitBehavior: "ignore"
  },
  (condiments) => {
    condimentsLengthEl.textContent = condiments.activeContents.length;

    condiments.contents.forEach((content) => {
      if (content.isActive) {
        content.value.classList.add("selected");
      } else {
        content.value.classList.remove("selected");
      }
    });

    let total = 0;
    activeCondimentsEl.innerHTML = "";
    condiments.activeContents.forEach((content) => {
      const clone = content.value.cloneNode(true);
      clone.onclick = content.value.onclick;

      activeCondimentsEl.append(clone);

      total += parseFloat(content.value.getAttribute("data-value"));
    });

    condimentsCostEl.textContent = currencyFormatter.format(total);

    if (condiments.active.length === 3) {
      maxCondimentsMessage.classList.remove("visually-hidden");
    } else {
      maxCondimentsMessage.classList.add("visually-hidden");
    }
  }
);

condimentsEl.forEach((condiment) => {
  condiment.onclick = () => condiments.toggle(condiment);
});

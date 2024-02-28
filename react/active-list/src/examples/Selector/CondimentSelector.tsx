import { useActiveList } from "@uiloos/react";
import { Condiment } from "./Condiment";
import { Condiment as CondimentType } from "./types";
import "./Selector.css";

type Props = {
  condiments: CondimentType[];
};

export function CondimentsSelector({ condiments }: Props) {
  const condimentsList = useActiveList({
    contents: condiments,
    active: [],
    // Do not allow for more than three condiments.
    maxActivationLimit: 3,

    // When the limit is reached and more condiments are activated
    // simply ignore them and keep the original three condiments.
    maxActivationLimitBehavior: "ignore",
  });

  const cost = condimentsList.activeContents.reduce((acc, content) => {
    return acc + content.value.price;
  }, 0);

  return (
    <>
      <h2>
        You have selected {condimentsList.activeContents.length} condiments
      </h2>
      <div className="condiments">
        {condimentsList.activeContents.map((content) => (
          <Condiment key={content.value.id} content={content} />
        ))}
      </div>

      <h2>Please select up to three condiments</h2>
      <span className="error">
        {condimentsList.active.length === 3
          ? "You have selected the max number of condiments"
          : null}
      </span>
      <div className="condiments">
        {condimentsList.contents.map((content) => (
          <Condiment key={content.value.id} content={content} />
        ))}
      </div>

      <h2>Cost: {currencyFormatter.format(cost)}</h2>
    </>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

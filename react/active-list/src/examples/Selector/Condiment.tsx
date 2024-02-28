import classNames from "classnames";
import { ActiveListContent } from "@uiloos/core";
import { Condiment as CondimentType } from "./types";

type Props = {
  content: ActiveListContent<CondimentType>;
};

export function Condiment({ content }: Props) {
  const condiment = content.value;

  return (
    <button
      className={classNames("condiment", {
        selected: content.isActive,
      })}
      onClick={() => content.toggle()}
    >
      <h4>{condiment.name}</h4>
      <p>{condiment.description}</p>
      <b>${condiment.price}</b>
    </button>
  );
}

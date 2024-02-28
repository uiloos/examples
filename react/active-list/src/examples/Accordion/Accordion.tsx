import "./Accordion.css";
import { useActiveList } from "@uiloos/react";
import { AccordionItem } from "./types";

type Props = {
  items: AccordionItem[];
  activeId?: number | string;
};

export function Accordion({ items, activeId }: Props) {
  const accordion = useActiveList({
    contents: items,
    active: items.find((item) => item.id === activeId) ?? items[0],
  });

  return (
    <div className="accordion-example">
      {accordion.contents.map((content) => (
        <details
          key={content.value.id}
          open={content.isActive}
          onClick={(event) => {
            // Prevent default opening of details element,
            // and let the ActiveList handle this.
            event.preventDefault();

            content.activate();
          }}
        >
          <summary>{content.value.summary}</summary>

          <p>{content.value.content}</p>
        </details>
      ))}
    </div>
  );
}

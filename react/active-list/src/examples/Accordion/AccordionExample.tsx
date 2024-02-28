import { Accordion } from "./Accordion";

export function AccordionExample() {
  return (
    <>
      <Accordion
        activeId={2}
        items={[
          {
            id: 1,
            summary: "What is the meaning of life?",
            content:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!",
          },
          {
            id: 2,
            summary: "How many eggs are in the basket?",
            content:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!",
          },
          {
            id: 3,
            summary: "Who dunnit?",
            content:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!",
          },
        ]}
      />

      <div className="description">
        <p>This example shows an accordion component used as an FAQ.</p>

        <p>
          The "details" en "summary" HTML elements are used so it works without
          JavaScript enabled.
        </p>

        <p>
          "uiloos" enhances the elements by only allowing one "details" to be
          open at a single time.
        </p>

        <p>
          In the future you will not need "uiloos" to do this for you, as a
          "name" attribute on the "details" element is going to be introduced.
          When more than one "details" share the same "name" attribute only one
          item is allowed to be opened at the same time.
        </p>

        <p>
          When it has been released you should only use "uiloos" for this
          usecase if you want to support older browsers.
        </p>
      </div>
    </>
  );
}

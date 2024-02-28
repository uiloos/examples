import { useState } from "react";
import { SegmentedButton } from "./SegmentedButton";

export function SegmentedButtonExample() {
  // State for the SegmentedButton example
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center",
  );

  return (
    <>
      <div className="segment-example">
        <SegmentedButton
          buttons={[
            {
              label: "Left",
              onClick() {
                setTextAlign("left");
              },
            },
            {
              label: "Center",
              onClick() {
                setTextAlign("center");
              },
              active: true,
            },
            {
              label: "Right",
              onClick() {
                setTextAlign("right");
              },
            },
          ]}
        />

        <p style={{ textAlign }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi
          tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi
          dolorem nihil dolor illum asperiores incidunt distinctio quod modi,
          corporis quae neque!
        </p>
      </div>
      <div className="description">
        <p>
          A segmented button only allows one item to be active at the same time,
          which is a perfect usecase for the ActiveList.
        </p>
      </div>
    </>
  );
}

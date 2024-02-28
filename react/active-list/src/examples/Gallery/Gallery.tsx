import { useActiveList } from "@uiloos/react";
import { GalleryImage } from "./types";
import "./Gallery.css";

type Props = {
  images: GalleryImage[];
};

export function Gallery({ images }: Props) {
  const gallery = useActiveList({
    contents: images,
    active: images[0],
  });

  return (
    <div className="gallery-example">
      <div className="gallery-selected">
        <img
          width="1920"
          height="1280"
          src={gallery.lastActivated?.src}
          alt={gallery.lastActivated?.alt}
        />
      </div>

      <ul className="gallery-items">
        {gallery.contents.map((content) => (
          <li key={content.value.src}>
            <button onClick={() => content.activate()}>
              <img
                width="1920"
                height="1280"
                src={content.value.src}
                alt={content.value.alt}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

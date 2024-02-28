type Owl = {
  id: number;
  name: string;
  description: string;
  img: {
    src: string;
    author: string;
    attribution: string;
  };
};

import snow from "./images/snow.jpg";
import barn from "./images/barn.jpg";
import hawk from "./images/hawk.jpg";
import burrowing from "./images/burrowing.jpg";
import tawny from "./images/tawny.jpg";

export const owls: Owl[] = [
  {
    id: 1,
    name: "Snow owl",
    description:
      "The snowy owl (Bubo scandiacus), also known as the polar owl, the white owl and the Arctic owl, is a large, white owl of the true owl family. Snowy owls are native to the Arctic regions.",
    img: {
      src: snow,
      author: "Doug Kelley",
      attribution: "https://unsplash.com/@dkphotos",
    },
  },
  {
    id: 2,
    name: "Tawny owl",
    description:
      "The tawny owl (also called the brown owl; Strix aluco) is commonly found in woodlands across much of Eurasia and North Africa, and has 11 recognized subspecies.",
    img: {
      src: tawny,
      author: "Kai Wenzel",
      attribution: "https://unsplash.com/@kai_wenzel",
    },
  },
  {
    id: 3,
    name: "Barn owl",
    description:
      "The barn owl (Tyto alba) is the most widely distributed species of owl in the world and one of the most widespread of all species of birds, being found almost everywhere in the world.",
    img: {
      src: barn,
      author: "James Lee",
      attribution: "https://unsplash.com/@picsbyjameslee",
    },
  },
  {
    id: 4,
    name: "Burrowing owl",
    description:
      " The burrowing owl (Athene cunicularia) is a small, long-legged owl. Burrowing owls nest and roost in burrows, such as those excavated by prairie dogs.",
    img: {
      src: burrowing,
      author: "Ray Hennessy",
      attribution: "https://unsplash.com/@rayhennessy",
    },
  },
  {
    id: 5,
    name: "Northern hawk-owl",
    description:
      "The northern hawk-owl or northern hawk owl (Surnia ulula) is a medium-sized true owl of the northern latitudes. It is one of the few owls that is neither nocturnal nor crepuscular.",
    img: {
      src: hawk,
      author: "Erik Karits",
      attribution: "https://unsplash.com/@erik_karits",
    },
  },
];

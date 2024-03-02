import { Vase } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

export const SampleA: Vase = {
  sizeUnit: SizeUnit.Centimeter,
  height: 10,
  thickness: 0,
  profile: {
    sections: 4,
    pointSets: [
      {
        offset: 0,
        count: 4,
        angleStart: 0,
        angleStep: 0.25,
      },
      {
        offset: 0.5,
        count: 4,
        angleStart: 0.125,
        angleStep: 0.25,
      },
      {
        offset: -0.25,
        count: 2,
        angleStart: 0.4,
        angleStep: 0.2,
      },
    ],
  },
  slices: [
    {
      position: 0,
      radius: {
        value: 4,
      },
      rotation: {
        value: 0,
      },
    },
    {
      position: 1,
      radius: {
        value: 4,
      },
      rotation: {
        value: 0,
      },
    },
  ],
};

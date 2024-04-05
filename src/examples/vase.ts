import { Vase } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

export const SampleVase: Vase = {
  height: 10,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 4,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 4,
        angleStart: 0,
        angleStep: 0.25,
      },
      {
        offset: {
          value: 0.5,
          weightIn: 1,
          weightOut: 1,
        },
        count: 4,
        angleStart: 0.125,
        angleStep: 0.25,
      },
      {
        offset: {
          value: -0.25,
        },
        count: 2,
        angleStart: 0.4,
        angleStep: 0.2,
      },
    ],
  },
  slices: [
    {
      position: 0,
      radius: { value: 3, weightIn: 1, weightOut: 1 },
      rotation: { value: 0 },
      intensity: { value: 0 },
    },
    {
      position: 0.1,
      radius: { value: 5, weightIn: 1, weightOut: 1 },
      rotation: { value: Math.PI * 0.5 },
      intensity: { value: 1 },
    },
    {
      position: 0.4,
      radius: { value: 5, weightIn: 0.5, weightOut: 0 },
    },
    {
      position: 0.6,
    },
    {
      position: 0.7,
      intensity: { value: 1 },
    },
    {
      position: 0.8,
      radius: { value: 2 },
    },
    {
      position: 0.9,
      rotation: { value: Math.PI * 1.0 },
    },
    {
      position: 1.0,
      radius: { value: 3, weightIn: 0, weightOut: 1 },
      rotation: { value: Math.PI * 1.5 },
      intensity: { value: 0 },
    },
  ],
};

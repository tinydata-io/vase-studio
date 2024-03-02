import { Vec2 } from "@/lib/math2d";

export type ProfilePoint = {
  position: Vec2;
  angle: number;
  pointSetIndex: number;
};

export type GeneratedProfile = {
  referencePoints: ProfilePoint[];
  controlPoints: ProfilePoint[];
  curvePoints: Vec2[];
  sections: number;
  angleStart: number;
  angleStep: number;
};

export type DrawProps = {
  strokeWidth: number;
  viewBox: string;
  sections: number;
  profileRadius: number;
  maxOffset: number;
  angleStart: number;
  angleStep: number;
};

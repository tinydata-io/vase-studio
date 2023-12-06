import { Vec2 } from "@/lib/math2d";

export type ProfilePoint = {
  position: Vec2;
  angle: number;
  priority: number;
  color: string;
};

export type Profile = {
  referencePoints: ProfilePoint[];
  controlPoints: ProfilePoint[];
  curvePoints: Vec2[];
  sections: number;
  angleStep: number;
};

export type PointSet = {
  offset: number;
  count: number;
  angleStart: number;
  angleStep: number;
  color: string;
};

export type DrawProps = {
  strokeWidth: number;
  viewBox: string;
  sections: number;
  angleStart: number;
  angleStep: number;
  profileRadius: number;
  maxOffset: number;
};

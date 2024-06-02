import { Vase } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

import { Curve } from "@/components/svg";
import { Deconstructor } from "@/lib/vase/slices";

export type SideProfileProps = {
  vase: Vase;
  height: number;
  sizeUnit: SizeUnit;
  yStep: number;
  deconstructor: Deconstructor;
};

export const SideProfile = ({
  vase,
  height,
  sizeUnit,
  yStep,
  deconstructor,
}: SideProfileProps) => {
  const { sliceProperties, values } = deconstructor(
    vase,
    height,
    sizeUnit,
    yStep
  );

  const deconstructedProfile = values.map((point) => ({
    x: point.x,
    y: height - point.y,
  }));

  const width = height;
  const margin = 0.1 * height;

  const vbL = -margin;
  const vbT = -margin;
  const vbW = width + 2 * margin;
  const vbH = height + 2 * margin;

  return (
    <svg
      viewBox={`${vbL} ${vbT} ${vbW} ${vbH}`}
      width={512}
      height={512}
      style={{ border: "1px solid black" }}
    >
      {sliceProperties.map(
        (slice, i) =>
          slice && (
            <circle
              key={i}
              cy={height - slice.y}
              cx={slice.value.value}
              r={0.2}
              fill="red"
            />
          )
      )}

      <Curve curvePoints={deconstructedProfile} strokeWidth={0.05} />

      {deconstructedProfile.map((p, i) => (
        <circle key={i} cy={p.y} cx={p.x} r={0.075} fill="black" />
      ))}

      <polyline
        points={`0 ${height} 0 0`}
        fill="none"
        stroke="black"
        strokeDasharray="0.1, 0.1"
        strokeWidth={0.05}
      />
    </svg>
  );
};

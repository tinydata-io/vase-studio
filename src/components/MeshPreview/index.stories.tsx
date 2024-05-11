import type { Meta, StoryObj } from "@storybook/react";

import { MeshPreview, MeshPreviewProps } from ".";
import { getExample } from "@/examples/vase";

import { getVaseModelSlices } from "@/lib/vase/vase";
import { MeshBuilder, TrianglesPerQuad } from "@/lib/vase/meshBuilder";
import { SidePathOptimisationSettings } from "@/lib/units";

type VasePreviewSampleProps = MeshPreviewProps & {
  trianglesPerQuad: TrianglesPerQuad;
};

const meta: Meta<VasePreviewSampleProps> = {
  component: MeshPreview,
  parameters: {
    layout: "full",
    controls: {
      exclude: ["mesh", "orbitControls", "showStats"],
    },
  },
};

export default meta;
type Story = StoryObj<VasePreviewSampleProps>;

export const VasePreviewSample: Story = {
  args: {
    cameraPosition: { x: 0, y: 12, z: -12 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    showModel: true,
    showWireframe: false,
    showNormals: false,
    orbitControls: true,
    showStats: true,
    trianglesPerQuad: TrianglesPerQuad.Two,
  },
  argTypes: {
    trianglesPerQuad: {
      options: Object.values(TrianglesPerQuad),
      control: { type: "radio" },
    },
  },
  render: (args, { globals: { example } }) => {
    const vase = getExample(example);

    const os = SidePathOptimisationSettings[vase.sizeUnit];
    const yStep = 0.1 * os.convertToCentimetersScale; // 1mm layers

    const startTime = performance.now();

    const modelSlices = getVaseModelSlices(vase, yStep);

    const generatedSlicesTime = performance.now();

    const meshBuilder = new MeshBuilder(args.trianglesPerQuad);
    meshBuilder.triangulateBase(modelSlices[0]);
    meshBuilder.triangulateSlices(modelSlices);

    const triangulatedSlicesTime = performance.now();

    const mesh = meshBuilder.build();

    const meshBuiltTime = performance.now();

    const totalTime = (meshBuiltTime - startTime).toFixed(2);
    const slicingTime = (generatedSlicesTime - startTime).toFixed(2);
    const triangulatingTime = (
      triangulatedSlicesTime - generatedSlicesTime
    ).toFixed(2);
    const buildTime = (meshBuiltTime - triangulatedSlicesTime).toFixed(2);

    const timing = `Total time: ${totalTime}ms (slicing: ${slicingTime}ms, triangulating: ${triangulatingTime}, buildTime: ${buildTime}ms)`;
    const debugStyle = { fontSize: "0.75em" };

    return (
      <>
        <MeshPreview {...args} mesh={mesh} />
        <div style={debugStyle}>Triangles: {mesh.triangles.length}</div>
        <div style={debugStyle}>{timing}</div>
      </>
    );
  },
};

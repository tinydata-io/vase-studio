import type { Meta, StoryObj } from "@storybook/react";

import { MeshPreview, MeshPreviewProps } from ".";
import { getExample, Example } from "@/examples/vase";

import { getVaseModelSlices } from "@/lib/vase/vase";
import { MeshBuilder } from "@/lib/vase/meshBuilder";

const meta: Meta<typeof MeshPreview> = {
  component: MeshPreview,
  parameters: {
    layout: "full",
    controls: { exclude: ["mesh", "orbitControls", "showStats"] },
  },
};

export default meta;
type Story = StoryObj<typeof MeshPreview>;

export const VasePreviewSample: Story = {
  args: {
    cameraPosition: { x: 0, y: 8, z: -10 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    meshRotation: 0,
    showModel: true,
    showWireframe: false,
    showNormals: false,
    orbitControls: true,
    showStats: true,
  },
  argTypes: {
    meshRotation: {
      control: {
        type: "range",
        min: 0,
        max: 6.2831,
        step: 0.05,
      },
    },
  },
  render: (args, { globals: { example } }) => {
    const vase = getExample(example);
    const modelSlices = getVaseModelSlices(vase);

    const meshBuilder = new MeshBuilder();
    meshBuilder.triangulateBase(modelSlices[0]);
    meshBuilder.triangulateSlices(modelSlices);

    const mesh = meshBuilder.build();

    return <MeshPreview {...args} mesh={mesh} />;
  },
};

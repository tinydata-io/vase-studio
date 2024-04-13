import type { Meta, StoryObj } from "@storybook/react";

import { MeshPreview, MeshPreviewProps } from ".";
import { getExample, Example } from "@/examples/vase";

import { getVaseModelSlices } from "@/lib/vase/vase";
import { MeshBuilder } from "@/lib/vase/meshBuilder";

type MeshPreviewStoryProps = MeshPreviewProps & { example: Example };

const meta: Meta<MeshPreviewStoryProps> = {
  component: MeshPreview,
  parameters: { layout: "full", controls: { exclude: ["mesh"] } },
};

export default meta;
type Story = StoryObj<MeshPreviewStoryProps>;

export const VasePreviewSample: Story = {
  args: {
    example: Example.SampleVase,
    cameraPosition: { x: 0, y: 8, z: -10 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    meshRotation: 0,
    showModel: true,
    showWireframe: false,
    showNormals: false,
  },
  argTypes: {
    example: {
      control: "select",
      options: Object.values(Example),
    },
    meshRotation: {
      control: {
        type: "range",
        min: 0,
        max: 6.2831,
        step: 0.05,
      },
    },
  },
  render: ({ example, ...args }) => {
    const vase = getExample(example);
    const modelSlices = getVaseModelSlices(vase);

    const meshBuilder = new MeshBuilder();
    meshBuilder.triangulateBase(modelSlices[0]);
    meshBuilder.triangulateSlices(modelSlices);

    const mesh = meshBuilder.build();

    return <MeshPreview {...args} mesh={mesh} />;
  },
};

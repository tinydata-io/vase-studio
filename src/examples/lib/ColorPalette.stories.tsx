import type { Meta, StoryObj } from "@storybook/react";
import { Color } from "@/lib/types";
import { DefaultPalette } from "@/lib/colors";

type ColorPaletteProps = {
  colors: Color[];
};

// Inspired by https://coolors.co
const ColorPalette = ({ colors }: ColorPaletteProps) => {
  return (
    <div style={{ display: "flex" }}>
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
            height: "300px",
            width: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <span style={{ color: "white" }}>{color}</span>
        </div>
      ))}
    </div>
  );
};

const meta: Meta<typeof ColorPalette> = {
  component: ColorPalette,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const DefaultPalettePreview: Story = {
  args: {
    colors: DefaultPalette,
  },
};

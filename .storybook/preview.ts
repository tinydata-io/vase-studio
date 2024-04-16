import log from "loglevel";

import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

import { Example } from "../src/examples/vase";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    example: {
      description: "Vase example used in stories",
      defaultValue: "Sample Vase",
      toolbar: {
        icon: "box",
        items: Object.values(Example).map((value) => ({
          value,
          title: value,
        })),
        title: "Example",
        dynamicTitle: true,
      },
    },
  },
};

log.setLevel("debug");

export default preview;

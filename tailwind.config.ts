import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import * as defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;

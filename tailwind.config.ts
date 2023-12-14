import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;

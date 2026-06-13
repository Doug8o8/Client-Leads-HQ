import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"],
  },
];

export default config;

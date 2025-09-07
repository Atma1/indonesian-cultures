import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  server: {
    open: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/assets/**/*",
          dest: "assets",
        },
        {
          src: "src/**/*",
          dest: "src",
        },
      ],
    }),
  ],
});

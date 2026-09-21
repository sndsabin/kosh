import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "kosh: Bookmark Manager",
    permissions: ["bookmarks", "storage", "downloads"],
    browser_specific_settings: {
      gecko: {
        id: "{607ea70f-8edf-4298-8ec3-ea614c2b45eb}",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});

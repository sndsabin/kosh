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
        id: "37869f2f-9e8d-4d6d-8abc-71ec36ad91a9-kosh",
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

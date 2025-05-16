import { defineConfig, normalizePath } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import legacy from "@vitejs/plugin-legacy"
import { viteStaticCopy } from "vite-plugin-static-copy"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    legacy({ targets: ["defaults"] }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(resolve(__dirname, "./src/sub-apps")),
          dest: "src"
        }
      ]
    })
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        pptEditor: resolve(__dirname, "src/sub-apps/signit-ppt-editor/index.html")
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 1234,
    open: "/", // 自动打开浏览器
  }
})

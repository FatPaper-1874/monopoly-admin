import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import ElementPlus from 'unplugin-element-plus/vite';
import {visualizer} from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ElementPlus({}),
        visualizer({
            gzipSize: true,
            brotliSize: true,
            emitFile: false,
            filename: "test.html", //分析图生成的文件名
            open: true //如果存在本地服务端口，将在打包后自动展示
        }),
    ],
    server: {
        port: 7001,
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve(path.dirname("./"), "src"),
            },
        ],
    },
});

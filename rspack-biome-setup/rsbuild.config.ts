import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";

const { publicVars } = loadEnv({ prefixes: [""] });

export default defineConfig({
    plugins: [pluginReact()],
    source: {
        define: publicVars,
    },
    tools: {
        rspack: {
            plugins: [
                tanstackRouter({
                    target: "react",
                    autoCodeSplitting: true,
                    routesDirectory: "./src/routes",
                    generatedRouteTree: "./src/routeTree.gen.ts",
                }),
            ],
        },
    },
    html: {
        template: "./index.html",
    },
});

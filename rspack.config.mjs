import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { rspack } from "@rspack/core";

export default {
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["postcss-loader"],
                type: "css",
            },
            // ...
        ],
    },
    plugins: [
        new RsdoctorRspackPlugin(),
        new rspack.EnvironmentPlugin({
            APP_ENV: process.env.APP_ENV,
            API_BASE_URL: process.env.API_BASE_URL,
            WS_URL: process.env.WS_URL,
            WS_CLIENT: undefined,
            WS_USER: undefined,
            WS_PASSWORD: undefined,
        }),
    ],
};

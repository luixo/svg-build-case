const fs = require('fs');

const header = `Header: ${Math.random()}`;
fs.appendFileSync("./log.txt", `\n${header}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    fs.appendFileSync("./log.txt", `\nTimestamp: ${Date.now()}`);
    webpackConfig.module.rules = [
      ...webpackConfig.module.rules.map((rule) => {
        if (
          rule === "..." ||
          !(rule.test instanceof RegExp) ||
          !rule.test.source.includes("svg")
        ) {
          return rule;
        }
        // Grab the existing rule that handles SVG imports
        return {
          ...rule,
          test: new RegExp(
            rule.test.source.replace("svg", ""),
            rule.test.flags
          ),
          exclude: /\.svg$/,
        };
      }),
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ];
    return webpackConfig;
  },
};

module.exports = nextConfig;

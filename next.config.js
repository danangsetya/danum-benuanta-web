/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAIN_URL: process.env.MAIN_URL,
  },
  images: {
    domains: ["localhost", "absen.danumbenuanta.id"],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: "node-loader",
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;

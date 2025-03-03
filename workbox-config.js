module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}"
  ],
  swDest: "dist/sw.js",
  swSrc: "public/sw.js",
  maximumFileSizeToCacheInBytes: 5000000
};
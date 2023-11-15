// workbox-config.js

module.exports = {
    "globDirectory": "dist/",
    "globPatterns": [
      "**/*.{js,png,html,css,json}"
      // Add any other file extensions you want to cache
    ],
    "swDest": "dist/sw.js",
    "swSrc": "src/service-worker.js",
  };
  
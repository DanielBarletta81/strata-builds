import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Strata Builds",
    short_name: "STRATA",
    description: "Scientific data, made explorable.",
    start_url: "/",
    display: "browser",
    background_color: "#07131a",
    theme_color: "#07131a",
    icons: [
      {
        src: "/icons/strata-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/strata-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

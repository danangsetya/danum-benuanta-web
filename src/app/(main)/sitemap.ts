import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kerja.tirtaalamtarakan.co.id",
      lastModified: new Date(),
    },
  ];
}

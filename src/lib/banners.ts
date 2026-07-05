import bannerConfig from "../../public/banners/config.json";

export type BannerKey = "square" | "skyscraper" | "skyscraper2" | "leaderboard";

export interface BannerEntry {
  image: string;
  url: string;
  alt: string;
}

export const BANNER_SIZES: Record<BannerKey, { width: number; height: number }> = {
  square: { width: 300, height: 300 },
  skyscraper: { width: 160, height: 600 },
  skyscraper2: { width: 160, height: 600 },
  leaderboard: { width: 728, height: 90 },
};

export function getBanner(key: BannerKey): BannerEntry {
  return bannerConfig[key];
}

export function getBannerImageSrc(key: BannerKey): string {
  const { image } = getBanner(key);
  return `/banners/${image}`;
}

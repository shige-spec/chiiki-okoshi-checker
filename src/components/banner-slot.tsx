import { BANNER_SIZES, getBanner, getBannerImageSrc, type BannerKey } from "@/lib/banners";

type BannerSlotProps = {
  bannerKey: BannerKey;
  className?: string;
};

function AdLabel() {
  return (
    <span
      className="pointer-events-none absolute right-1 bottom-1 text-[10px] leading-none text-white"
      aria-hidden="true"
    >
      [広告]
    </span>
  );
}

export function BannerSlot({ bannerKey, className = "" }: BannerSlotProps) {
  const banner = getBanner(bannerKey);
  const { width, height } = BANNER_SIZES[bannerKey];
  const imageSrc = getBannerImageSrc(bannerKey);

  const frameClass =
    "relative flex items-center justify-center overflow-hidden border border-dashed border-brand-muted bg-brand-light/30";

  if (!banner.image) {
    return (
      <div
        className={`${frameClass} ${className}`}
        style={{ width, height, maxWidth: "100%" }}
        aria-label={banner.alt}
      >
        <span className="px-2 text-center text-xs text-muted-foreground">
          {width}×{height}
        </span>
        <AdLabel />
      </div>
    );
  }

  const bannerBody = (
    <div className="relative" style={{ width, height, maxWidth: "100%" }}>
      <img
        src={imageSrc}
        alt={banner.alt}
        width={width}
        height={height}
        className="block object-cover"
        style={{ width, height, maxWidth: "100%" }}
      />
      <AdLabel />
    </div>
  );

  const content = banner.url ? (
    <a
      href={banner.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block transition-opacity hover:opacity-90"
      aria-label={banner.alt}
    >
      {bannerBody}
    </a>
  ) : (
    bannerBody
  );

  return (
    <div className={className} style={{ width, maxWidth: "100%" }}>
      {content}
    </div>
  );
}

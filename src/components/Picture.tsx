import Image from "next/image";

/**
 * A content image, or a drawn placeholder while no licensed photo exists.
 * Pass priority for the hero image (LCP); every other image stays lazy.
 */
export function Picture({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 768px, 100vw",
}: {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-brand-soft to-brand/30 ${className}`}
      />
    );
  }
  return (
    <div className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

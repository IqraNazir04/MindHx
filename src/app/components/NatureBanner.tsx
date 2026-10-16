import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
};

// Photos are real, verified-free Unsplash images (not Unsplash+), served via
// Unsplash's own CDN per their guidelines. The Unsplash License doesn't
// require attribution (it's appreciated, not mandated), and the on-image
// credit links were dropped so nothing clickable sits on top of the photo -
// photographerName/photographerUrl are kept on the type in case a plain-text
// credit is wanted somewhere later.
//
// `sizes` defaults to the full-bleed hero banner layout most pages use.
// Callers that render this at a narrower width (e.g. a two-column split)
// should pass their own `sizes` so Next requests an appropriately smaller
// image instead of the full 1120px desktop variant.
export default function NatureBanner({ src, alt, caption, priority, sizes = "(max-width: 800px) 100vw, 1120px" }: Props) {
  return (
    <figure className="nature-banner">
      <Image src={src} alt={alt} width={1600} height={560} sizes={sizes} priority={priority} loading={priority ? undefined : "lazy"} />
      {caption && <figcaption className="nature-banner-caption">{caption}</figcaption>}
    </figure>
  );
}

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  caption?: string;
  priority?: boolean;
};

// Photos are real, verified-free Unsplash images (not Unsplash+), served via
// Unsplash's own CDN per their guidelines. The Unsplash License doesn't
// require attribution (it's appreciated, not mandated), and the on-image
// credit links were dropped so nothing clickable sits on top of the photo -
// photographerName/photographerUrl are kept on the type in case a plain-text
// credit is wanted somewhere later.
export default function NatureBanner({ src, alt, caption, priority }: Props) {
  return (
    <figure className="nature-banner">
      <Image src={src} alt={alt} width={1600} height={560} sizes="(max-width: 800px) 100vw, 1120px" priority={priority} loading={priority ? undefined : "lazy"} />
      {caption && <figcaption className="nature-banner-caption">{caption}</figcaption>}
    </figure>
  );
}

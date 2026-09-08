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
// Unsplash's own CDN per their guidelines, with visible attribution as their
// license requests.
export default function NatureBanner({ src, alt, photographerName, photographerUrl, caption, priority }: Props) {
  return (
    <figure className="nature-banner">
      <Image src={src} alt={alt} width={1600} height={560} sizes="(max-width: 800px) 100vw, 1120px" priority={priority} loading={priority ? undefined : "lazy"} />
      {caption && <figcaption className="nature-banner-caption">{caption}</figcaption>}
      <div className="nature-banner-credit">
        Photo by{" "}
        <a href={`${photographerUrl}?utm_source=mindhx&utm_medium=referral`} target="_blank" rel="noopener noreferrer">{photographerName}</a>
        {" "}on{" "}
        <a href="https://unsplash.com/?utm_source=mindhx&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a>
      </div>
    </figure>
  );
}

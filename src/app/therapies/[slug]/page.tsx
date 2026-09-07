import { notFound } from "next/navigation";
import { therapies, getTherapy } from "../data";
import TherapyDetail from "./TherapyDetail";

export function generateStaticParams() {
  return therapies.map((therapy) => ({ slug: therapy.slug }));
}

export default async function TherapyPage({ params }: PageProps<"/therapies/[slug]">) {
  const { slug } = await params;
  const therapy = getTherapy(slug);
  if (!therapy) notFound();
  return <TherapyDetail therapy={therapy} />;
}

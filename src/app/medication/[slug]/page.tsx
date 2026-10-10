import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { medications, getMedication } from "../data";
import { pageMetadata } from "../../lib/seo";
import MedicationDetail from "./MedicationDetail";

export function generateStaticParams() {
  return medications.map((medication) => ({ slug: medication.slug }));
}

export async function generateMetadata({ params }: PageProps<"/medication/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const medication = getMedication(slug);
  if (!medication) return {};
  return pageMetadata({
    title: `${medication.en.name} | Medication Reference`,
    description: medication.en.use,
    path: `/medication/${slug}`,
  });
}

export default async function MedicationPage({ params }: PageProps<"/medication/[slug]">) {
  const { slug } = await params;
  const medication = getMedication(slug);
  if (!medication) notFound();
  return <MedicationDetail medication={medication} />;
}

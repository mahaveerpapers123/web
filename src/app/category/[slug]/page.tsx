// src/app/category/[slug]/page.tsx
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryRedirect({ params }: Props) {
  const { slug } = await params; // Next 15 promised params
  redirect(`/shopping?category=${encodeURIComponent(slug)}`);
}

import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const target = params.category ? `/cars?category=${params.category}` : "/cars";
  redirect(target);
}

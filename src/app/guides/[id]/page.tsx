import { guides } from "../../../data/mockGuides";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    return <h1>Guide not found</h1>;
  }

  return (
    <main>
      <h1>{guide.title}</h1>
      <p>{guide.description}</p>
    </main>
  );
}
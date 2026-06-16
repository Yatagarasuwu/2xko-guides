import { guides } from "../../../data/mockGuides";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guide = guides.find((g) => g.id === id);
  const championNames = id.split("-").filter(Boolean);

  const title =
    guide?.title ??
    (championNames.length === 2
      ? `${championNames[0][0].toUpperCase() + championNames[0].slice(1)} / ${championNames[1][0].toUpperCase() + championNames[1].slice(1)} Team`
      : "Team Guide");

  const description =
    guide?.description ??
    (championNames.length === 2
      ? "A custom duo route built from your selected champions."
      : "Pick two champions to build a team route.");

  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}
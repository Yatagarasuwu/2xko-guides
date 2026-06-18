import { GuideWorkspace } from "../../../components/guide-workspace";
import { getGuideById } from "../../../data/mockGuides";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;

  const guide = getGuideById(id);

  return (
    <GuideWorkspace guide={guide} mode={mode === "edit" ? "edit" : "view"} />
  );
}
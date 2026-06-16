import { GuideWorkspace } from "../../../components/guide-workspace";
import { getGuideById } from "../../../data/mockGuides";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guide = getGuideById(id);

  return (
    <GuideWorkspace guide={guide} />
  );
}
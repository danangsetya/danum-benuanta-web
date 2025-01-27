import ReloadFace from "@/components/pages/faceReload";
import { useRouter } from "next/router";

export default function page({ params }: { params: { n: number; d: string } }) {
  return <ReloadFace params={params} />;
}

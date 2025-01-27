"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function ReloadFace({
  params,
}: {
  params: { n: number; d: string };
}) {
  const router = useRouter();
  useLayoutEffect(() => {
    console.log("from reload");
    router.replace("/face/add/" + params.n + "/" + params.d);
  }, []);
  return <></>;
}

import EditorTest from "@/components/pages/editor";
import TestThumb from "@/components/pages/testThumb";
import TestingPage from "@/components/pages/testing";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  console.log("ie->", process.env.FS_1);
  // const { toast } = useToast();
  return (
    <>
      <TestThumb />
      {/* <TestingPage /> */}
      {/* <Toaster /> */}
      {/* <EditorTest /> */}
    </>
  );
}

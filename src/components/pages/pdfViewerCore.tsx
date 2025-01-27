"use client";

import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";

export default function PdfViewerCore() {
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={"/document/sample.pdf"}
          defaultScale={SpecialZoomLevel.PageFit}
        />
      </Worker>
    </>
  );
}

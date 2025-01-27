"use client";

import { PdfJs, Viewer } from "@react-pdf-viewer/core";
import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
import "./pdfViewer.css";
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types";
export default function PdfViewer() {
  type PDFFile = string | File | null;
  const resizeObserverOptions = {};

  const maxWidth = 800;
  const [numPages, setNumPages] = useState<number>();
  const [containerWidth, setContainerWidth] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [file, setFile] = useState<PDFFile>("/document/sample.pdf");
  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);
  // function onDocumentLoadSuccess({
  //   numPages: nextNumPages,
  // }: PDFDocumentProxy): OnDocumentLoadSuccess {
  //   setNumPages(nextNumPages);
  // }
  useResizeObserver(containerRef, resizeObserverOptions, onResize);
  useEffect(() => {
    console.log(
      "containerWidth->",
      containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
    );
  }, [containerWidth]);
  return (
    <div className="Example">
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className="Example__container">
        <div className="Example__container__document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={({ numPages: nextNumPages }: any) => {
              setNumPages(nextNumPages);
            }}
            options={{
              cMapUrl: "/cmaps/",
              standardFontDataUrl: "/standard_fonts/",
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}

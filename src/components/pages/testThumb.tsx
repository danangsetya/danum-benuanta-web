"use client";

import {
  Viewer,
  Worker,
  type Plugin,
  type RenderViewer,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { dropPlugin } from "@react-pdf-viewer/drop";
export default function TestThumb() {
  interface PageThumbnailPluginProps {
    PageThumbnail: React.ReactElement;
  }

  const pageThumbnailPlugin = (props: PageThumbnailPluginProps): Plugin => {
    const { PageThumbnail } = props;

    return {
      renderViewer: (renderProps: RenderViewer) => {
        let { slot } = renderProps;

        slot.children = PageThumbnail;

        if (slot.subSlot !== undefined) {
          // Reset the sub slot
          slot.subSlot.attrs = {};
          slot.subSlot.children = <></>;
        }

        return slot;
      },
    };
  };

  const ThumbnailCover: React.FC<{
    fileUrl: string;
  }> = ({ fileUrl }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
      PageThumbnail: <Cover getPageIndex={() => 0} />,
    });

    return (
      <Viewer
        fileUrl={fileUrl}
        plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
      />
    );
  };
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const dropPluginInstance = dropPlugin();
  return (
    <Worker workerUrl="/js/pdf.worker.js">
      {/* <div
        data-testid="second-doc-cover"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "20rem",
          margin: "5rem auto",
          width: "20rem",
        }}
      >
        <ThumbnailCover fileUrl="/document/sample.pdf" />
      </div> */}
      <ThumbnailCover fileUrl="/document/sample" />
      {/* <Viewer
        fileUrl="/document/sample"
        plugins={[
          //Register plugins
          defaultLayoutPluginInstance,
          dropPluginInstance,
        ]}
      /> */}
    </Worker>
  );
}

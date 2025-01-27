import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import mammoth from "mammoth";
import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
export const toTable = (
  dataExcel: any[][],
  ref?: LegacyRef<HTMLTableElement>
) => {
  return (
    <>
      {dataExcel.length > 0 && (
        <table
          ref={ref}
          className="h-[600px] w-[600px]  overflow-hidden  flex flex-col p-5   absolute left-[100vw]"
        >
          {dataExcel.map((item, index) => {
            if (index == 0) {
              return (
                <thead className="border-2 " key={index}>
                  <tr>
                    {item.length > 0 &&
                      item.map((item2, index2) => {
                        return (
                          <th key={index2} className="border-2 py-1 px-2">
                            {item2}
                          </th>
                        );
                      })}
                  </tr>
                </thead>
              );
            } else {
              return (
                <tbody className="border-2 " key={index}>
                  <tr>
                    {item.length > 0 &&
                      item.map((item2, index2) => {
                        return (
                          <td key={index2} className="border-2 py-1 px-2">
                            {item2}
                          </td>
                        );
                      })}
                  </tr>
                </tbody>
              );
            }
          })}
        </table>
      )}
    </>
  );
};
export default function ThumbnailDocExcel({ fileUrl }: { fileUrl: string }) {
  const pRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLTableElement>(null);
  const [blob, setBlob] = useState<Blob | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [dump, setDump] = useState<string | any[][] | undefined>();
  const handleConvBlob = async () => {
    const blob = await fetch(fileUrl).then((r) => r.blob());
    // console.log(blob);
    // console.log(blob.type);
    if (
      blob.type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      blob.type == "application/msword"
    ) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target !== null) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          const allP = value.split("</p>");
          if (allP.length > 0) {
            // console.log("allP->", allP);
            let newH = "";
            allP.forEach((item) => {
              let txt = item.replaceAll("<p>", "");
              if (txt.length > 50) {
                txt = `<p class="text-justify leading-loose">${txt}</p>`;
              } else {
                txt = `<p class="text-center leading-loose">${txt}</p>`;
              }
              newH += txt;
            });
            // console.log(newH);
            setDump(newH);
          } else {
            const xHtml = value.replaceAll("<p>", `<p class="text-center">`);
            setDump(xHtml);
            // console.log(xHtml);
          }
        }
      };
      reader.onerror = () => {
        throw new Error("Fail to load the file");
      };
      reader.readAsArrayBuffer(blob);
    } else if (
      blob.type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      blob.type == "application/vnd.ms-excel"
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target !== null && event.target.result !== null) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          });

          setDump(jsonData);
        }
      };

      reader.readAsArrayBuffer(blob);
    }
    // setBlob(blob);
  };
  const handleDump = async () => {
    if (dump !== undefined && typeof dump == "string") {
      const canvas = await html2canvas(pRef.current as HTMLElement);
      const image = canvas.toDataURL("image/png", 1.0);
      // console.log("image->", image);
      setImage(image);
      // setHtml(undefined)
    } else if (dump !== undefined && typeof dump == "object") {
      const canvas = await html2canvas(xRef.current as HTMLElement);
      const image = canvas.toDataURL("image/png", 1.0);
      // console.log("image->", image);
      setImage(image);
    }
  };
  useEffect(() => {
    handleConvBlob();
  }, [fileUrl]);
  useEffect(() => {
    handleDump();
    // console.log("typeof->", typeof dump);
  }, [dump]);
  return (
    <div className="flex justify-center items-center ">
      {image == undefined && (
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl"
          color="#0284c7"
        />
      )}

      {image !== undefined && (
        <Image src={image} alt="Preview" width={200} height={200} />
      )}
      {dump !== undefined && typeof dump == "string" && (
        <div
          ref={pRef}
          className="h-[600px] w-[600px]  overflow-hidden  flex flex-col p-5   absolute left-[100vw]"
        >
          {/* absolute left-[100vw] */}
          {/* <DocumentViewer
            className="flex-1 "
            queryParams="hl=Nl"
            url={filePath}
            viewerUrl={filePath}
            viewer="mammoth"
          /> */}

          <div
            className="doc-viewer"
            dangerouslySetInnerHTML={{ __html: dump }}
          />
        </div>
      )}
      {dump !== undefined && typeof dump == "object" && toTable(dump, xRef)}
    </div>
  );
}

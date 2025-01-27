"use client";

import "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";
import html2canvas from "html2canvas";
import mammoth from "mammoth";
import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";

import { DocumentViewer } from "react-documents";
import * as XLSX from "xlsx";
export default function TestPreviewDoc() {
  const iRef = useRef<HTMLInputElement>(null);
  const pRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLTableElement>(null);
  const [filePath, setFilePath] = useState<string | undefined>();
  const [fileBlob, setFileBlob] = useState<Blob | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [docUri, setDocUri] = useState<
    { uri: string; fileType: string; fileName: string } | undefined
  >();
  const [html, setHtml] = useState<string | undefined>();
  const [dataExcel, setDataExcel] = useState<any[][] | undefined>();
  const toTable = (dataExcel: any[][], ref?: LegacyRef<HTMLTableElement>) => {
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
                  <thead key={index} className="border-2 ">
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
                  <tbody key={index} className="border-2 ">
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

    // if (dataExcel.length > 0) {
    //   const tabl = document.createElement("table");
    //   const table = dataExcel.map((row, index) => {
    //     if (typeof row == "object" && row.length > 0) {
    //       const rowx: string[] = row;
    //       if (rowx.length > 0) {
    //         const thead = tabl.createTHead();
    //         const ix = 0;
    //         const th = thead.insertRow();
    //         rowx.map((it2, ix2) => {
    //           if (ix == 0) {
    //             const tc = th.insertCell();
    //             tc.innerHTML = it2;
    //           }
    //         });
    //       }
    //     }
    //   });
    //   return tabl;
    // }
  };
  useEffect(() => {
    console.log("dataExcel->", dataExcel);
  }, [dataExcel]);
  useEffect(() => {
    console.log("filePath->", filePath);
    if (filePath !== undefined) {
      // mammoth.convertToHtml({ path: filePath }).then((e) => {
      //   console.log(e);
      // });
    }
  }, [filePath]);
  useEffect(() => {
    if (fileBlob !== undefined) {
      const reader = new FileReader();
      // reader.readAsDataURL(fileBlob);
      reader.onload = async (event) => {
        if (event.target !== null) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          const allP = value.split("</p>");
          if (allP.length > 0) {
            console.log("allP->", allP);
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
            console.log(newH);
            setHtml(newH);
          } else {
            const xHtml = value.replaceAll("<p>", `<p class="text-center">`);
            setHtml(xHtml);
            console.log(xHtml);
          }
        }
      };
      reader.onerror = () => {
        throw new Error("Fail to load the file");
      };
      reader.readAsArrayBuffer(fileBlob);
    }
  }, [fileBlob]);
  const handleHTML = async () => {
    if (html !== undefined) {
      const canvas = await html2canvas(pRef.current as HTMLElement);
      const image = canvas.toDataURL("image/png", 1.0);
      console.log("image->", image);
      setImage(image);
      // setHtml(undefined)
    }
  };
  const handleDataExcel = async () => {
    if (dataExcel !== undefined) {
      const canvas = await html2canvas(xRef.current as HTMLElement);
      const image = canvas.toDataURL("image/png", 1.0);
      console.log("image->", image);
      setImage(image);
    }
  };
  useEffect(() => {
    handleHTML();
  }, [html]);
  useEffect(() => {
    handleDataExcel();
  }, [dataExcel]);
  return (
    <>
      <input
        type="file"
        ref={iRef}
        onChange={async (e) => {
          if (e.target.files !== null) {
            const file = e.target.files[0];
            console.log(file.type);
            // console.log("file->", file.webkitRelativePath);
            // const resp = await axios.get(
            //   "http://localhost:3002/api/docview/files/PKS-VPS.docx",
            //   {
            //     responseType: "blob",
            //   }
            // );
            // const blob = new Blob([resp.data], {
            //   type: "application/pdf",
            // });
            // const blobUrl = URL.createObjectURL(blob);
            // // setDocUri(URL.createObjectURL(file));
            // setDocUri({
            //   uri: blobUrl,
            //   fileType: "docx",
            //   fileName: "PKS-VPS.docx",
            // });
            // return;
            if (
              file.type ==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              file.type == "application/vnd.ms-excel"
            ) {
              console.log("here");
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

                  setDataExcel(jsonData);
                }
              };

              reader.readAsArrayBuffer(file);
            } else {
              setFilePath(URL.createObjectURL(file));
              setFileBlob(file);
            }
            // console.log(e.target.files);
            // application/vnd.openxmlformats-officedocument.wordprocessingml.document
            // application/vnd.ms-excel
            // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            // application/msword
          }
        }}
      />
      <h1>Preview Doc</h1>
      <hr />
      {image !== undefined && (
        <Image src={image} alt="Preview" width={200} height={200} />
      )}
      {dataExcel !== undefined && toTable(dataExcel, xRef)}
      {/* {dataExcel !== undefined && (
        <div className="min-h-[90vh] w-1/2  flex flex-col p-5 bg-purple-300 ">
          <h3>Excel Data:</h3>
          <pre>{JSON.stringify(dataExcel, null, 2)}</pre>
        </div>
      )} */}
      {docUri !== undefined && (
        <div>
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={[docUri]}
            className="flex-1"
          />
        </div>
      )}
      {html !== undefined && (
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
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </>
  );
}

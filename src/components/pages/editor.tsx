"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";

export default function EditorTest() {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  // useEffect(() => {
  //   console.log("public url->", process.env.PUBLIC_URL);
  // }, []);
  return (
    <>
      <Editor
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        onChange={(e) => {
          console.log(e);
        }}
        apiKey="ibxg33f4tevup4scdon2az673jf8035wnsqi12buzfws6jv3"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          branding: false,
          height: 400,
          menubar: true,
          plugins:
            "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
          toolbar:
            "formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
          image_advtab: true,
          // height: 500,
          // menubar: false,
          // plugins: [
          //   "advlist",
          //   "autolink",
          //   "lists",
          //   "link",
          //   "image",
          //   "charmap",
          //   "preview",
          //   "anchor",
          //   "searchreplace",
          //   "visualblocks",
          //   "code",
          //   "fullscreen",
          //   "insertdatetime",
          //   "media",
          //   "table",
          //   "code",
          //   "help",
          //   "wordcount",
          // ],
          // toolbar:
          //   "undo redo | blocks | " +
          //   "bold italic forecolor | alignleft aligncenter " +
          //   "alignright alignjustify | bullist numlist outdent indent | " +
          //   "removeformat | help",
          // content_style:
          //   "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}

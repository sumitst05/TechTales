import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

function WriteArticle() {
  const [editorBody, setEditorBody] = useState("");

  const editorStyle = {
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  const handleEditorChange = (editorBody) => {
    setEditorBody(editorBody);
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center gap-4">
      <input
        type="text"
        placeholder="TITLE"
        className="relative text-center outline-none font-bold text-4xl font-serif text-gray-800 w-2/3 placeholder-gray-500"
      />
      <ReactQuill
        theme="snow"
        style={editorStyle}
        value={editorBody}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        placeholder="Write something amazing..."
      />
    </div>
  );
}

export default WriteArticle;

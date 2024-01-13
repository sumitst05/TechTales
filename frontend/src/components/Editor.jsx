import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Editor() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "link",
    "image",
    "list",
    "bullet",
    "indent",
    "code-block",
    "blockquote",
    "align",
    "color",
    "background",
  ];

  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      placeholder="Write something amazing..."
      className="w-2/3"
    />
  );
}

export default Editor;

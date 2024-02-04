const editorStyle = {
  width: "80%",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["image"],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "bullet",
  "link",
  "image",
];

export { editorStyle, modules, formats };

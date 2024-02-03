function Tags({
  value,
  onChange,
  onKeyDown,
  toggleSuggestions,
  suggestionRef,
  suggestions,
	highlightIndex,
}) {
  return (
    <>
      <input
        type="text"
        id="search_tags"
        placeholder="Enter tags to filter"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className="text-center bg-slate-100 p-1 rounded-lg outline-none outline-violet-700 outline-2 w-full"
      />

      {toggleSuggestions && (
        <div
          className="absolute z-10 w-full bg-slate-100 p-2 mt-2 rounded-lg shadow-lg overflow-auto"
          ref={suggestionRef}
        >
          {suggestions.tags.length > 0 ? (
            suggestions.tags.map((tag, index) => (
              <div
                key={index}
                className={`flex justify-center items-center hover:bg-slate-200 ${
                  highlightIndex === index ? "bg-slate-200" : ""
                }`}
              >
                <p className="font-medium text-slate-500">{tag}</p>
              </div>
            ))
          ) : (
            <p className="flex mt-2 justify-center text-slate-400">
              No tags found
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default Tags;

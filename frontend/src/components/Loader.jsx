function Loader() {
  return (
    <div className="fixed top-1/2 place-self-center flex flex-col items-center gap-6">
      <img
        src="/loader.png"
        alt="loader"
        className="h-14 w-14 object-cover animate-spin"
      />
      <p className="font-bold text-violet-700 text-4xl">Loading...</p>
    </div>
  );
}

export default Loader;

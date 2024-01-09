import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center font-semibold p-4 my-7 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
        Sign In
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
        />
        <button className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Sign In
        </button>
        <button className="bg-indigo-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95">
          Continue with Google
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-slate-700">Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;

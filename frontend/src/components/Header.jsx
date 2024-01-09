import { Link } from "react-router-dom";
import logoImage from "../../assets/icon_small.png";

function Header() {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <div className="flex items-center">
            <h1 className="text-2xl text-gray-200 font-bold">TechTales</h1>
            <img src={logoImage} alt="TechTales Logo" className="h-12 w-12" />
          </div>
        </Link>
        <ul className="flex gap-4">
          <Link to="/explore">
            <li className="font-semibold text-gray-300">Explore</li>
          </Link>
          <Link to="/learn-more">
            <li className="font-semibold text-gray-300">Learn More</li>
          </Link>
          <Link to="/sign-in">
            <li className="font-semibold text-gray-300">Sign In</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Header;

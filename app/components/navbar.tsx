import { Link } from "@remix-run/react";
import { Home, Briefcase, PersonStanding } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="z-50 fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md py-3 px-6 rounded-full shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
          <Home size={20} />
          <span className="font-medium">Home</span>
        </Link>
        <Link
          to="/jobs"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
          <Briefcase size={20} />
          <span className="font-medium">Jobs</span>
        </Link>        
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
          <PersonStanding size={20} />
          <span className="font-medium">Sign In</span>
        </Link>
      </div>
    </nav>
  );
}
import { Link } from '@remix-run/react';
import Navbar from "../components/navbar";

export default function Index() {
    return (
        <div className="min-h-screen relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/background.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative">
                <Navbar />
            </div>

            <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-bold text-white mb-2">
                        OpusVita Jobs
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-2">Bringing Commuting Developers to the Office.</h2>

                    <div className="text-2xl text-white mb-8">
                        <h2>Developers:</h2>
                        <ul className="mt-2">
                            <li>Andrew - B01649915</li>
                            <li>Lucas - B01652603</li>
                        </ul>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                        <Link
                            to="/login"
                            className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                            Create Account
                        </Link>
                        <Link
                            to="/jobs"
                            className="block w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                            Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
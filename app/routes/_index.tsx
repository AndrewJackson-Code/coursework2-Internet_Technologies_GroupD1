import { Link } from '@remix-run/react';

export default function Index() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to Job Finder</h1>
            <div className="space-y-4">
                <Link 
                    to="/login" 
                    className="block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center">
                    Login
                </Link>
                <Link 
                    to="/signup" 
                    className="block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center">
                    Create Account
                </Link>
            </div>
        </div>
    );
}
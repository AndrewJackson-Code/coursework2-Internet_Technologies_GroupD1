// app/routes/jobs.tsx
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import Navbar from "../components/navbar";
import type { LoaderFunctionArgs } from '@remix-run/node';

// Define types for our API response
type Job = {
    id: number;
    role: string;
    company_name: string;
    location: string;
    remote: boolean;
    text: string;
    url: string;
};

type ApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Job[];
};

// Function to fetch jobs
export async function loader({ request }: LoaderFunctionArgs) {
    // Get search parameters from the URL
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const location = url.searchParams.get('location') || '';

    // Construct the API URL with search parameters
    const apiUrl = new URL('https://findwork.dev/api/jobs/');
    if (search) apiUrl.searchParams.set('search', search);
    if (location) apiUrl.searchParams.set('location', location);
    apiUrl.searchParams.set('sort_by', 'relevance');

    try {
        const response = await fetch(apiUrl.toString(), {
            headers: {
                'Authorization': `Token ${process.env.API_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json() as ApiResponse;
        return json(data);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return json({ count: 0, next: null, previous: null, results: [] });
    }
}

// Component to render the jobs page
export default function Jobs() {
    const data = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Function to handle form submission
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const search = formData.get('search') as string;
        const location = formData.get('location') as string;
        
        // Update URL with search parameters
        setSearchParams({ search, location });
    };

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-100 py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Jobs
                            </label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                defaultValue={searchParams.get('search') || ''}
                                className="w-full px-4 py-2 border rounded-md"/>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                defaultValue={searchParams.get('location') || ''}
                                className="w-full px-4 py-2 border rounded-md"/>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Search
                            </button>
                        </div>
                    </div>
                </form>

                {/* Results Count */}
                <p className="text-gray-600 mb-4">
                    Found {data.count} jobs
                </p>

                {/* Job Listings */}
                <div className="space-y-4">
                    {data.results.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{job.role}</h2>
                                    <p className="text-gray-600">{job.company_name}</p>
                                </div>
                                {job.remote && (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                        Remote
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4">{job.location}</p>
                            <div className="mt-4">
                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600">
                                    View Job →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
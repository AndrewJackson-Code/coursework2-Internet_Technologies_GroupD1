import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import Navbar from "../components/navbar";
import type { LoaderFunctionArgs } from '@remix-run/node';

// Keep the type definitions and loader function unchanged
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

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const location = url.searchParams.get('location') || '';

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

export default function Jobs() {
    const data = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const search = formData.get('search') as string;
        const location = formData.get('location') as string;
        setSearchParams({ search, location });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">

            <div className="relative h-[400px]">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/background.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative">
                    <Navbar />
                </div>

                <div className="relative h-full flex items-center justify-center px-4">
                    <div className="w-full max-w-4xl">
                        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-6">
                            <div className="grid md:grid-cols-[1fr,1fr,auto] gap-4">
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Jobs
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        defaultValue={searchParams.get('search') || ''}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        placeholder="e.g. React Developer"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        defaultValue={searchParams.get('location') || ''}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        placeholder="e.g. London"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="h-10 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <p className="text-lg font-medium text-gray-900 mb-6">
                        Found {data.count} jobs
                    </p>

                    <div className="space-y-4">
                        {data.results.map((job) => (
                            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{job.role}</h2>
                                        <p className="text-gray-600">{job.company_name}</p>
                                    </div>
                                    {job.remote && (
                                        <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                                            Remote
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4">{job.location}</p>
                                <div className="mt-4 flex justify-end">
                                    <a
                                        href={job.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                                        View Job →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
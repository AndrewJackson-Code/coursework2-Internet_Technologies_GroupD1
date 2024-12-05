// app/routes/dashboard.tsx
import { Form, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { getUsersCollection } from '~/functions/db.server';

// Get user data when page loads
export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url);
        const email = url.searchParams.get('email');
        
        console.log('Dashboard loader - Email from URL:', email);

        if (!email) {
            console.log("No email provided in URL");
            return redirect('/login');
        }

        const users = await getUsersCollection();
        const user = await users.findOne({ email });
        
        console.log('Dashboard loader - User found:', !!user);
        console.log('Dashboard loader - User data:', user);

        if (!user) {
            console.log("No user found in database");
            return redirect('/login');
        }

        return json({ user });
    } catch (error) {
        console.error('Dashboard loader error:', error);
        return redirect('/login');
    }
}

// Handle account deletion
export async function action({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        const users = await getUsersCollection();
        await users.deleteOne({ email });
        
        return redirect('/');
    } catch (error) {
        return redirect('/dashboard');
    }
}

export default function Dashboard() {
    const { user } = useLoaderData<typeof loader>();

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
                    
                    <div className="space-y-6">
                        <div>
                            <p>First Name: {user.firstname}</p>
                            <p>Last Name: {user.lastname}</p>
                            <p>Email: {user.email}</p>
                        </div>

                        <Form method="delete">
                            <input type="hidden" name="email" value={user.email} />
                            <button
                                type="submit"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={(e) => {
                                    if (!confirm('Delete your account?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Delete Account
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
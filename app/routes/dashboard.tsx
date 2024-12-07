// app/routes/dashboard.tsx
import { Form, useLoaderData, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import Navbar from "../components/navbar";
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { getUsersCollection } from '~/functions/db.server';
import bcrypt from 'bcrypt';

// The loader function remains the same as before
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

        if (!user) {
            console.log("Cannot find that user in DB.");
            return redirect('/login');
        }

        return json({ user });
    } catch (error) {
        console.error('Dashboard loader error:', error);
        return redirect('/login');
    }
}

// Enhanced action function to handle both updates and deletions
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    // Get database connection
    const users = await getUsersCollection();
    const currentEmail = formData.get('currentEmail') as string;

    // Handle account deletion
    if (intent === 'delete') {
        await users.deleteOne({ email: currentEmail });
        return redirect('/');
    }

    // Handle account update
    if (intent === 'update') {
        const updates: any = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email')
        };

        // Only update password if a new one is provided
        const newPassword = formData.get('password') as string;
        if (newPassword) {
            updates.password = await bcrypt.hash(newPassword, 10);
        }

        // Update the user in the database
        await users.updateOne(
            { email: currentEmail },
            { $set: updates }
        );

        // Redirect to reflect the new email if it was changed
        return redirect(`/dashboard?email=${encodeURIComponent(updates.email)}`);
    }
}

export default function Dashboard() {
    const { user } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-100 py-20">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
                    
                    {/* Update Form */}
                    <Form method="post" className="space-y-6">
                        <input type="hidden" name="intent" value="update" />
                        <input type="hidden" name="currentEmail" value={user.email} />
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    defaultValue={user.firstname}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    defaultValue={user.lastname}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    defaultValue={user.email}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password (leave blank to keep current)
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Details
                            </button>
                        </div>
                    </Form>

                    {/* Delete Account Form */}
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                        <Form method="post">
                            <input type="hidden" name="intent" value="delete" />
                            <input type="hidden" name="currentEmail" value={user.email} />
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
        </>
    );
}
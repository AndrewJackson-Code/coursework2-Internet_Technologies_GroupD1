import { Form, useActionData, Link } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import Navbar from "../components/navbar";
import type { ActionFunctionArgs } from '@remix-run/node';
import { getUsersCollection } from '~/functions/db.server';
import bcrypt from 'bcrypt';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const users = await getUsersCollection();
        const user = await users.findOne({ email });

        console.log('Login attempt:', {
            emailProvided: email,
            userFound: !!user,
        });


        if (!user) {
            return json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Pass the email as a URL parameter for now we'll need sessions for the full implementation
            return redirect(`/dashboard?email=${encodeURIComponent(email)}`);
        } else {
            return json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return json({ error: 'Login failed' });
    }
}

export default function Login() {
    const actionData = useActionData<typeof action>();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                    <Form method="post" className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input type="text" name="email" id="email" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input type="password" name="password" id="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required />
                        </div>


                        {actionData?.error && (
                            <p className="text-red-500 text-sm">{actionData.error}</p>
                        )}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
                                Login
                            </button>
                            <Link
                                to="/"
                                className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 text-center">
                                Back
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}
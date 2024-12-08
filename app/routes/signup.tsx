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
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;

    try {
        const users = await getUsersCollection();
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return json({ error: 'An account with this Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await users.insertOne({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            createdAt: new Date()
        });

        return redirect('/login');
    } catch (error) {
        return json({ error: 'Registration failed' });
    }
}

export default function SignUp() {
    const actionData = useActionData<typeof action>();

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
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>

                    <Form method="post" className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                Surname
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                required
                            />
                        </div>

                        {actionData?.error && (
                            <p className="text-red-500 text-sm font-medium">{actionData.error}</p>
                        )}

                        <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-green-500 text-white rounded-lg px-4 py-3 hover:bg-green-600 transition-colors duration-200 font-medium">
                                Create Account
                            </button>
                            <Link
                                to="/"
                                className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-3 hover:bg-gray-600 transition-colors duration-200 font-medium text-center">
                                Back
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
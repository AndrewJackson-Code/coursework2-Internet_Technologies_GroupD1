import { Form, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { getUsersCollection } from '~/functions/db.server';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const users = await getUsersCollection();
    const user = await users.findOne({ username, password });

    if (user) {
        return redirect('/dashboard');
    }

    return json({ error: 'Invalid credentials' });
}

export default function Login() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <Form method="post" className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>
                    {actionData?.error && (
                        <p className="text-red-500 text-sm">{actionData.error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                    >
                        Login
                    </button>
                </Form>
            </div>
        </div>
    );
}
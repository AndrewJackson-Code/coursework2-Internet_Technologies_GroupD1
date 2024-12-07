// app/routes/signup.tsx
import { Form, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import Navbar from "../components/navbar";
import type { ActionFunctionArgs } from '@remix-run/node';
import { getUsersCollection } from '~/functions/db.server';
import bcrypt from 'bcrypt';

// This function handles the form submission
export async function action({ request }: ActionFunctionArgs) {
    // Get the form data from the request
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;

    try {
        const users = await getUsersCollection();
        
        // Check if email already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return json({ error: 'Email Address already exists' });
        }

        // Hash the password before storing it
        // The number 10 determines how secure the hash is - higher numbers are more secure but slower
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await users.insertOne({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            createdAt: new Date()
        });

        // Redirect to login page after successful registration
        return redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        return json({ error: 'Registration failed' });
    }
}

// This is the component that renders the registration form
export default function SignUp() {
    const actionData = useActionData<typeof action>();

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
                
                <Form method="post" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input type="text" name="email" id="email" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required/>
                    </div>
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input type="firstname" name="firstname" id="firstname" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required/>
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                            Sirname
                        </label>
                        <input type="lastname" name="lastname" id="lastname" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input type="password" name="password" id="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required/>
                    </div>

                    {actionData?.error && (
                        <p className="text-red-500 text-sm">{actionData.error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600">
                        Create Account
                    </button>
                </Form>
            </div>
        </div>
        </>
    );
}
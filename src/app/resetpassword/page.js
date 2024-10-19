"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPassword() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Extract the token from the URL
    useEffect(() => {
        setError('');
        const urlToken = window.location.search.split('=')[1];  // Get token from URL
        setToken(urlToken || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('/api/users/resetpassword', { token, newPassword });
            if (response.status === 200) {
                setSuccess("Password reset successfully! You can now log in.");
                setError('');
            }
        } catch (error) {
            setError("An error occurred while resetting the password.");
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='mb-4'>Reset Password</h1>

            {success ? (
                <div>
                    <p className='text-green-600'>{success}</p>
                    <Link href="/login">Go to Login</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                    <div className='mb-4'>
                        <label className='block mb-2'>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='border border-gray-300 p-2 rounded-lg'
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block mb-2'>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='border border-gray-300 p-2 rounded-lg'
                            required
                        />
                    </div>

                    {error && <p className='text-red-600'>{error}</p>}

                    <button type="submit" className='bg-blue-500 text-white py-2 px-4 rounded-lg'>
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    );
}

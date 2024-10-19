"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ResetForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/reset', { email });
            setMessage(response.data.message);
            setError(''); // clear error
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setMessage(''); // clear message
        }
    };

    return (
        <div className='h-[100vh] w-100 flex justify-center items-center'>
            <div className='max-w-sm mx-auto bg-sky-800 rounded-lg p-10'>
                <h1 className='text-white text-center text-bold text-2xl py-4'>Input Email to Reset</h1>
                <form onSubmit={handleSubmit}>
                    <fieldset className='flex flex-col gap-3 w-full'>
                        <label className='text-white' htmlFor="email">Email ID</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='rounded-lg p-1 outline-none border border-gray-100'
                            required
                        />
                    </fieldset>
                    <button
                        type='submit'
                        className='bg-sky-500 text-white rounded-lg p-2 mt-4 w-full'>
                        Submit
                    </button>
                </form>
                {message && <p className='text-green-500'>{message}</p>}
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </div >
    );
}

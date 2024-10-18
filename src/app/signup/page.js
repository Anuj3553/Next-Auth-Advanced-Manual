"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter()

    const [user, setUser] = useState({
        email: '',
        password: '',
        username: ''
    })

    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSignup = async () => {
        try {
            setLoading(true)
            const res = await axios.post('/api/users/signup', user)
            console.log("Signup Success", res.data)
            setLoading(false)
            router.push('/login')
        }
        catch (error) {
            console.log("Signup Failed", error.message)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div>
            <div className='flex flex-col items-center justify-center min-h-screen py-2'>
                <h1 className='text-5xl font-bold mb-10'>{loading ? "Processing" : "Signup"}</h1>
                <hr />
                <label htmlFor="username">Username</label>
                <input id='username' className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder='Username' />
                <label htmlFor="email">Email</label>
                <input id='email' className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder='Email' />
                <label htmlFor="password">Password</label>
                <input id='password' className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder='Password' />

                <button onClick={onSignup} className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
                    {buttonDisabled ? "No Signup" : "Signup"}
                </button>
                <Link href="/login">Visit Login Page</Link>
            </div>
        </div>
    )
}


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
    })

    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onLogin = async () => {
        try {
            setLoading(true)
            const res = await axios.post('/api/users/login', user)
            console.log("Login Success", res.data)
            setLoading(false)
            router.push('/profile')
        }
        catch (error) {
            console.log("Signup Failed", error.message)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div>
            <div className='flex flex-col items-center justify-center min-h-screen py-2'>
                <h1 className='text-5xl font-bold mb-10'>{loading ? "Processing" : "Login"}</h1>
                <hr />
                <label htmlFor="email">Email</label>
                <input id='email' className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder='Email' />
                <label htmlFor="password">Password</label>
                <input id='password' className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder='Password' />

                <button onClick={onLogin} className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
                    {buttonDisabled ? "No Login" : "Login"}
                </button>
                <Link href="/signup">Visit Signup Page</Link>
            </div>
        </div>
    )
}


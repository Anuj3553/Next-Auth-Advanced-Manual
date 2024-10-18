"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
// import { useRouter } from 'next/router';

export default function VerifyEmail() {

    // const router = useRouter()

    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');

    const verifyEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
            setError(false);
        } catch (error) {
            setError(true);
            console.log(error.message);
        }
    }

    useEffect(() => {
        setError(false)
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "");

        // Good Practive for Next.js -->
        
        // const {query} = router;
        // const urlTokenTwo = query.token
        // setToken(urlTokenTwo || "");

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setError(false)
        if (token.length > 0) {
            verifyEmail();
        }
        // eslint-disable-next-line
    }, [token])

    return (
        <>
            <div className='flex flex-col items-center justify-center min-h-screen py-2'>
                <h1>Verify Email</h1>
                <h2 className='p-2 bg-orange-500 text-black'>
                    {token ? `Token: ${token}` : "No token found"}
                </h2>
                {verified && (
                    <div>
                        <h2>Verified</h2>
                        <Link href="/login">Login</Link>
                    </div>
                )}

                {error && (
                    <div>
                        <h2>Error</h2>
                    </div>
                )}
            </div>
        </>
    )
}


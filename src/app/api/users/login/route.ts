import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validation logs
        console.log(reqBody);

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        console.log("User exists");

        // Compare passwords
        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json({ error: "Check your credentials" }, { status: 400 });
        }

        // Token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // Sign the token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        // Create response and set token cookie
        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        // Return response to avoid error
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}

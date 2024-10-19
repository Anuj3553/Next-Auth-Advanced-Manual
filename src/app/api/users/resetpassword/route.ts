import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token, newPassword } = reqBody;

        console.log("Reset Password Token : ", token);

        // Find the user based on the reset token
        const user = await User.findOne({
            forgotPasswordToken: { $exists: true }, // Ensure there's a token
            forgotPasswordTokenExpiry: { $gt: Date.now() }, // Ensure the token hasn't expired
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Compare the hashed token with the user's _id
        const isMatch = await bcryptjs.compare(user._id.toString(), token);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        // Hash the new password and update the user
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined; // Clear the token after use
        user.forgotPasswordTokenExpiry = undefined; // Clear the expiry after use

        // Save the updated user object
        await user.save();

        return NextResponse.json({
            message: "Password reset successfully",
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}

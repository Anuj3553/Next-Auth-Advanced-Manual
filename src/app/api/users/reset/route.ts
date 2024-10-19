import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailers";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate a reset password token (hashed user ID in this case)
        const hashedToken = await bcryptjs.hash(user._id.toString(), 10);

        // Save the reset token and expiry to the user model
        user.forgotPasswordToken = hashedToken;
        user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Send the password reset email
        await sendEmail({
            email,
            emailType: 'RESET',
            userId: user._id.toString(),
        });

        return NextResponse.json({
            message: 'Password reset email sent successfully',
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
